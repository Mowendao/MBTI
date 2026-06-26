const API_BASE = 'https://api.deepseek.com/v1/chat/completions';

export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatMode = 'mbti' | 'bigfive';

/** 发送对话消息到 DeepSeek API（流式） */
export async function sendChatMessage(
  apiKey: string,
  messages: Message[],
  systemPrompt: string,
  onPartial?: (text: string) => void,
): Promise<{ ok: true; content: string } | { ok: false; error: string }> {
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
          ...messages.slice(-20), // 只传最近 20 条控制 token
        ],
        max_tokens: 1024,
        temperature: 0.8,
        stream: true,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: `API 错误 (${res.status}): ${errText.slice(0, 100)}` };
    }

    // Handle streaming
    const reader = res.body?.getReader();
    if (!reader) {
      return { ok: false, error: '无法读取响应流' };
    }

    let fullContent = '';
    const decoder = new TextDecoder();

    const processStream = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullContent += delta;
              onPartial?.(fullContent);
            }
          } catch {
            // skip parse errors
          }
        }
      }
    };

    await processStream();

    if (!fullContent.trim()) {
      return { ok: false, error: 'AI 返回内容为空' };
    }

    return { ok: true, content: fullContent.trim() };
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'TimeoutError') {
      return { ok: false, error: '请求超时，请检查网络或 API Key 是否有效' };
    }
    return { ok: false, error: e instanceof Error ? e.message : '网络请求失败' };
  }
}

/** 清理 AI 回复中的分析注释（括号内以"当前判断/当前评估/最终判断/最终评估"开头的内容） */
export function cleanAnalysisNotes(content: string): string {
  return content.replace(/（[^）]*?(?:当前判断|当前评估|最终判断|最终评估|信心度)[^）]*?）/g, '');
}

/** 从 AI 回复中提取最终 MBTI 类型 */
export function extractMbtiResult(content: string): string | null {
  const match = content.match(/[IE][NS][TF][JP]/);
  return match?.[0] || null;
}
