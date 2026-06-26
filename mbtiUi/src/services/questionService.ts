import { Question } from '@/types/mbti';
import { questions as defaultQuestions } from '@/data/questions';

const QUESTIONS_KEY = 'mbti_questions';

export const questionService = {
  getQuestions(): Question[] {
    const saved = localStorage.getItem(QUESTIONS_KEY);
    return saved ? JSON.parse(saved) : defaultQuestions;
  },

  saveQuestions(questions: Question[]): void {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  },

  resetToDefault(): void {
    localStorage.removeItem(QUESTIONS_KEY);
  },

  exportJSON(): string {
    return JSON.stringify(this.getQuestions(), null, 2);
  },

  downloadFile(): void {
    const json = this.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mbti-questions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON(json: string): { ok: true; count: number } | { ok: false; error: string } {
    let data: unknown;
    try {
      data = JSON.parse(json);
    } catch {
      return { ok: false, error: 'JSON 格式解析失败，请检查文件内容' };
    }

    if (!Array.isArray(data)) {
      return { ok: false, error: '数据格式错误：应为题目数组' };
    }

    if (data.length === 0) {
      return { ok: false, error: '导入数据为空' };
    }

    const validated: Question[] = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (!item.id || typeof item.id !== 'number') {
        return { ok: false, error: `第 ${i + 1} 题缺少有效 id` };
      }
      if (!item.text || typeof item.text !== 'string') {
        return { ok: false, error: `第 ${i + 1} 题缺少题目文本 (text)` };
      }
      if (!['EI', 'SN', 'TF', 'JP'].includes(item.dimension)) {
        return { ok: false, error: `第 ${i + 1} 题维度无效 (dimension)，应为 EI/SN/TF/JP 之一` };
      }
      if (!Array.isArray(item.options) || item.options.length === 0) {
        return { ok: false, error: `第 ${i + 1} 题缺少选项 (options)` };
      }
      for (let j = 0; j < item.options.length; j++) {
        const opt = item.options[j];
        if (typeof opt.text !== 'string' || typeof opt.value !== 'number') {
          return { ok: false, error: `第 ${i + 1} 题的第 ${j + 1} 个选项格式错误，需包含 text/value` };
        }
      }
      validated.push(item as Question);
    }

    this.saveQuestions(validated);
    return { ok: true, count: validated.length };
  },

  getStats(): { total: number; byDimension: Record<string, number> } {
    const qs = this.getQuestions();
    const byDimension: Record<string, number> = {};
    qs.forEach(q => {
      byDimension[q.dimension] = (byDimension[q.dimension] || 0) + 1;
    });
    return { total: qs.length, byDimension };
  },

  // API-based methods for admin (when connected to backend)
  async fetchFromApi(): Promise<Question[]> {
    const { default: api } = await import('./api');
    const res = await api.get('/questions');
    return res.data.data;
  },
};
