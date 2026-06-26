import type { Question, TestResult } from '@/types/mbti';
import type { LiuYaoResult } from '@/utils/liuyao';

const API_BASE = 'https://api.deepseek.com/v1/chat/completions';
const SESSION_KEY = 'mbti_deepseek_api_key';

/** 保存 API Key 到 sessionStorage（关闭浏览器即清除） */
export function saveApiKey(key: string) {
  sessionStorage.setItem(SESSION_KEY, key);
}

/** 获取当前 API Key */
export function getApiKey(): string {
  return sessionStorage.getItem(SESSION_KEY) || '';
}

/** 清除 API Key */
export function clearApiKey() {
  sessionStorage.removeItem(SESSION_KEY);
}

/** 脱敏显示 API Key */
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return key ? '****' : '';
  return `${key.slice(0, 3)}****${key.slice(-4)}`;
}

/** 测试 API 连接 */
export async function testConnection(apiKey: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: '请回复"连接成功"' }],
        max_tokens: 10,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 100)}` };
    }
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : '网络请求失败' };
  }
}

const SYSTEM_PROMPT = `你是一个专业的 MBTI 性格测试题目解析助手。
用户会提供一段文本（来自 Word 文档），其中包含 MBTI 性格测试的题目。
请你从文本中提取所有题目，并严格按照以下 JSON 数组格式输出，不要输出任何多余内容：

[
  {
    "id": 1,
    "text": "题目文本",
    "dimension": "EI",
    "options": [
      { "text": "选项A文本", "value": 1 },
      { "text": "选项B文本", "value": 7 }
    ]
  }
]

规则：
- dimension 只能是 "EI"、"SN"、"TF"、"JP" 之一
- options 中的 value 范围 1-7，1 代表完全倾向第一个维度，7 代表完全倾向第二个维度
- 如果文档中有明确的选项分数/倾向标注，请据此赋值；否则根据语义合理赋值
- id 从 1 开始递增
- 只输出 JSON，不要输出任何其他说明文字`;

/** 调用 DeepSeek API 解析文本为题目 */
export async function parseQuestionsFromText(
  text: string,
  apiKey: string,
): Promise<{ ok: true; questions: Question[] } | { ok: false; error: string }> {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text.slice(0, 12000) }, // 限制长度避免超 token
        ],
        max_tokens: 4000,
        temperature: 0.1,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: `API 错误 (${res.status}): ${errText.slice(0, 150)}` };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return { ok: false, error: 'API 返回内容为空' };
    }

    // 尝试提取 JSON（可能被 markdown 代码块包裹）
    let jsonStr = content;
    const codeMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeMatch) {
      jsonStr = codeMatch[1];
    }

    const parsed = JSON.parse(jsonStr.trim());
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { ok: false, error: '未解析出有效的题目数据' };
    }

    // 校验并规范化
    const questions: Question[] = [];
    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      if (!item.text || typeof item.text !== 'string') continue;
      if (!['EI', 'SN', 'TF', 'JP'].includes(item.dimension)) continue;
      if (!Array.isArray(item.options) || item.options.length < 2) continue;

      questions.push({
        id: item.id || (i + 1),
        text: item.text,
        dimension: item.dimension,
        options: item.options.map((opt: { text: string; value: number }) => ({
          text: String(opt.text || ''),
          value: Math.max(1, Math.min(7, Number(opt.value) || 4)),
        })),
      });
    }

    if (questions.length === 0) {
      return { ok: false, error: '解析出的题目格式不符合要求，请检查文档内容' };
    }

    return { ok: true, questions };
  } catch (e: unknown) {
    if (e instanceof SyntaxError) {
      return { ok: false, error: 'API 返回内容无法解析为 JSON，请重试' };
    }
    return { ok: false, error: e instanceof Error ? e.message : '未知错误' };
  }
}

// ===== AI 性格深度分析 =====

const ANALYSIS_SYSTEM_PROMPT = `你是一位温暖、专业的性格洞察师，拥有深厚的 MBTI 理论功底和丰富的咨询经验。
用户刚完成了 MBTI 性格测试，请根据他们的测试结果，以第二人称（“你”）写一段个性化的深度分析。

要求：
1. 语气温暖、真诚，像朋友对话一样，不要太学术化
2. 结合用户具体的维度百分比来分析，不要泛泛而谈
3. 按以下结构输出（使用 Markdown 格式）：

## 🎨 你的性格画像
用一段生动的文字描绘用户的性格特质，让读者产生“这就是在说我”的感觉

## ✨ 隐藏的优势
指出 2-3 个用户可能自己都没意识到的独特优势

## 🌱 成长盲区
温柔地指出 2-3 个需要注意的潜在问题，并给出具体建议

## 💬 人际沟通指南
给出与其他性格类型沟通的实用建议，特别是和“相反类型”的相处之道

## 💫 一句话送给你
一句原创的、有力量的鼓励语（不要名人名言）

4. 总字数控制在 600-800 字
5. 直接输出分析内容，不要加任何前缀说明`;

/** AI 深度性格分析（MBTI） */
export async function analyzePersonality(
  result: TestResult,
  apiKey: string,
): Promise<{ ok: true; analysis: string } | { ok: false; error: string }> {
  const { type, percentage } = result;
  const userPrompt = `我的 MBTI 测试结果：
类型：${type}
维度百分比：
- 外向(E) ${percentage.E}% / 内向(I) ${percentage.I}%
- 感觉(S) ${percentage.S}% / 直觉(N) ${percentage.N}%
- 思考(T) ${percentage.T}% / 情感(F) ${percentage.F}%
- 判断(J) ${percentage.J}% / 感知(P) ${percentage.P}%

请给我一份个性化的深度分析。`;

  return callChatAPI(apiKey, ANALYSIS_SYSTEM_PROMPT, userPrompt);
}

/** AI 深度性格分析（六爻） */
export async function analyzeLiuYaoPersonality(
  result: LiuYaoResult,
  apiKey: string,
): Promise<{ ok: true; analysis: string } | { ok: false; error: string }> {
  const { originalHexagram, changedHexagram, mbtiType, mbtiScores, userQuestion, mode } = result;

  // 问卦模式：结合用户问题解读
  if (mode === 'divination' && userQuestion) {
    const divinationPrompt = `你是一位精通易经六爻的智慧师，拥有深厚的卦象解读经验和人生咨询能力。
用户向你提问了一个具体的问题，并摇出了一卦。请你结合用户的问题和卦象，给出深入的个性化解读。

要求：
1. 语气温暖、智慧、真诚，像一位值得信赖的师长
2. 紧扣用户的具体问题来解读，不要泛泛而谈
3. 按以下结构输出（使用 Markdown 格式）：

## 🎴 卦象解读
解释本卦的含义，以及与用户问题的关联

## 🔄 变化之道
如果有变卦，解释变卦和动爻的含义，指出事情的发展趋势

## 💡 智慧指引
结合卦象给出对用户问题的具体建议（3-4 条实用建议）

## ⚠️ 注意事项
提醒用户需要注意的方面

## 🌟 结语
一句结合卦象和用户问题的鼓励语

4. 总字数控制在 500-700 字
5. 直接输出分析内容`;

    const userPrompt = `我的问题是：${userQuestion}

摇卦结果：
本卦：${originalHexagram.name}（${originalHexagram.meaning}）
${changedHexagram ? `变卦：${changedHexagram.name}（${changedHexagram.meaning}）
动爻：第 ${result.movingYaoIndices.join('、')} 爻` : '无变卦'}

请结合我的问题和卦象给我一份解读。`;

    return callChatAPI(apiKey, divinationPrompt, userPrompt);
  }

  // 职业模式 / 默认模式：性格分析
  const userPrompt = `我完成了易经六交${mode === 'career' ? '职业' : ''}性格测试：
本卦：${originalHexagram.name}（${originalHexagram.meaning}）
${changedHexagram ? `变卦：${changedHexagram.name}（${changedHexagram.meaning}）` : '无变卦'}
推演 MBTI 类型：${mbtiType}
维度得分：${JSON.stringify(mbtiScores)}

请结合易经卦象和 MBTI 结果，给我一份个性化的${mode === 'career' ? '职业性格' : '性格'}深度分析。`;

  return callChatAPI(apiKey, ANALYSIS_SYSTEM_PROMPT, userPrompt);
}

/** 通用 chat 调用 */
async function callChatAPI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<{ ok: true; analysis: string } | { ok: false; error: string }> {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: `API 错误 (${res.status}): ${errText.slice(0, 150)}` };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return { ok: false, error: 'AI 返回内容为空' };
    }

    return { ok: true, analysis: content.trim() };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : '网络请求失败' };
  }
}
