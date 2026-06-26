import { useState, useEffect } from 'react';
import { questionService } from '@/services/questionService';
import { parseQuestionsFromText, getApiKey } from '@/services/aiService';
import type { Question } from '@/types/mbti';

export default function QuestionManagement() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [form, setForm] = useState({ text: '', dimension: 'EI' as 'EI' | 'SN' | 'TF' | 'JP', opt1: '', opt2: '', opt1v: 1, opt2v: 7 });
  const [msg, setMsg] = useState('');

  // AI 导入状态
  const [aiStep, setAiStep] = useState<'idle' | 'parsing' | 'preview'>('idle');
  const [aiQuestions, setAiQuestions] = useState<Question[]>([]);
  const [aiMsg, setAiMsg] = useState('');

  useEffect(() => { setQuestions(questionService.getQuestions()); }, []);

  const refresh = () => setQuestions(questionService.getQuestions());

  const openAdd = () => {
    setEditing(null);
    setForm({ text: '', dimension: 'EI', opt1: '', opt2: '', opt1v: 1, opt2v: 7 });
    setShowModal(true);
  };

  const openEdit = (q: Question) => {
    setEditing(q);
    setForm({
      text: q.text,
      dimension: q.dimension,
      opt1: q.options[0]?.text || '',
      opt2: q.options[1]?.text || '',
      opt1v: q.options[0]?.value || 1,
      opt2v: q.options[1]?.value || 7,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.text || !form.opt1 || !form.opt2) { setMsg('请填写完整信息'); return; }
    const q: Question = {
      id: editing ? editing.id : Math.max(0, ...questions.map(q => q.id)) + 1,
      text: form.text,
      dimension: form.dimension,
      options: [
        { text: form.opt1, value: form.opt1v },
        { text: form.opt2, value: form.opt2v },
      ],
    };
    const all = editing
      ? questions.map(x => x.id === editing.id ? q : x)
      : [...questions, q];
    questionService.saveQuestions(all);
    setShowModal(false);
    setMsg('');
    refresh();
  };

  const handleDelete = (id: number) => {
    if (confirm('确定删除该题目？')) {
      questionService.saveQuestions(questions.filter(q => q.id !== id));
      refresh();
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const result = questionService.importJSON(text);
      if (result.ok) {
        setMsg(`导入成功：${result.count} 道题目`);
      } else {
        setMsg(`导入失败：${result.error}`);
      }
      refresh();
    };
    input.click();
  };

  const handleAiImport = () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setAiMsg('请先在「API 设置」中配置 DeepSeek API Key');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setAiStep('parsing');
      setAiMsg('正在解析 Word 文档...');
      try {
        // 动态导入 mammoth（按需加载）
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const { value: plainText } = await mammoth.default.extractRawText({ arrayBuffer });
        if (!plainText || plainText.trim().length < 20) {
          setAiMsg('文档内容为空或过少，无法解析');
          setAiStep('idle');
          return;
        }
        setAiMsg('文档解析成功，正在调用 AI 识别题目...');
        const result = await parseQuestionsFromText(plainText, apiKey);
        if (result.ok) {
          setAiQuestions(result.questions);
          setAiMsg(`成功识别 ${result.questions.length} 道题目，请检查后确认导入`);
          setAiStep('preview');
        } else {
          setAiMsg(`AI 解析失败：${result.error}`);
          setAiStep('idle');
        }
      } catch (err: unknown) {
        setAiMsg(`解析出错：${err instanceof Error ? err.message : '未知错误'}`);
        setAiStep('idle');
      }
    };
    input.click();
  };

  const confirmAiImport = () => {
    if (aiQuestions.length === 0) return;
    // 重新编号，避免 ID 冲突
    const maxId = Math.max(0, ...questions.map(q => q.id));
    const renumbered = aiQuestions.map((q, i) => ({ ...q, id: maxId + i + 1 }));
    const all = [...questions, ...renumbered];
    questionService.saveQuestions(all);
    refresh();
    setAiStep('idle');
    setAiQuestions([]);
    setAiMsg('');
    setMsg(`AI 导入成功：${renumbered.length} 道题目`);
  };

  const cancelAiImport = () => {
    setAiStep('idle');
    setAiQuestions([]);
    setAiMsg('');
  };

  const dimLabels: Record<string, string> = { EI: '精力态度 (EI)', SN: '认知方式 (SN)', TF: '决策方式 (TF)', JP: '生活方式 (JP)' };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>题目管理</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-cancel" onClick={handleAiImport}>🤖 AI 智能导入</button>
          <button className="btn btn-cancel" onClick={handleImport}>📥 导入</button>
          <button className="btn btn-primary" onClick={openAdd}>+ 添加题目</button>
        </div>
      </div>
      {msg && <p style={{ color: msg.includes('失败') ? '#d32f2f' : '#2e7d32', marginBottom: '1rem' }}>{msg}</p>}

      {/* AI 导入预览 */}
      {aiStep === 'parsing' && (
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px', marginBottom: '1rem', color: '#e65100' }}>
          ⏳ {aiMsg}
        </div>
      )}
      {aiStep === 'preview' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#e8f5e9', borderRadius: '8px', marginBottom: '1rem', color: '#2e7d32' }}>
            {aiMsg}
          </div>
          <div className="table-container" style={{ maxHeight: '400px', overflow: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr><th>ID</th><th>题目文本</th><th>维度</th><th>选项A</th><th>选项B</th></tr>
              </thead>
              <tbody>
                {aiQuestions.map(q => (
                  <tr key={q.id}>
                    <td>{q.id}</td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.text}</td>
                    <td><span className="status-badge active">{dimLabels[q.dimension] || q.dimension}</span></td>
                    <td>{q.options[0]?.text}</td>
                    <td>{q.options[1]?.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={confirmAiImport}>确认导入 ({aiQuestions.length} 题)</button>
            <button className="btn btn-cancel" onClick={cancelAiImport}>取消</button>
          </div>
        </div>
      )}
      {aiMsg && aiStep === 'idle' && (
        <p style={{ color: '#d32f2f', marginBottom: '1rem' }}>{aiMsg}</p>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>题目文本</th><th>维度</th><th>选项A</th><th>选项B</th><th>操作</th></tr>
          </thead>
          <tbody>
            {questions.length === 0 && <tr><td colSpan={6}><div className="empty-state"><p>暂无题目，请添加或导入</p></div></td></tr>}
            {questions.map(q => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.text}</td>
                <td><span className="status-badge active">{dimLabels[q.dimension] || q.dimension}</span></td>
                <td>{q.options[0]?.text}</td>
                <td>{q.options[1]?.text}</td>
                <td>
                  <button className="btn btn-edit btn-sm" onClick={() => openEdit(q)}>编辑</button>
                  <button className="btn btn-delete btn-sm" onClick={() => handleDelete(q.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h2>{editing ? '编辑题目' : '添加题目'}</h2>
            <div className="form-group">
              <label>题目文本</label>
              <textarea value={form.text} onChange={e => setForm({...form, text: e.target.value})} rows={3} />
            </div>
            <div className="form-group">
              <label>所属维度</label>
              <select value={form.dimension} onChange={e => setForm({...form, dimension: e.target.value as 'EI' | 'SN' | 'TF' | 'JP'})}>
                {Object.entries(dimLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>选项A 文本</label>
                <input value={form.opt1} onChange={e => setForm({...form, opt1: e.target.value})} />
              </div>
              <div className="form-group">
                <label>选项B 文本</label>
                <input value={form.opt2} onChange={e => setForm({...form, opt2: e.target.value})} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
