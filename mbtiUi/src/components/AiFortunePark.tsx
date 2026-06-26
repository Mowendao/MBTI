import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { getApiKey } from '@/services/aiService';
import { sendChatMessage, extractMbtiResult, type Message } from '@/services/aiChatService';
import './AiFortunePark.css';

interface AssessmentType {
  id: number;
  code: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  sysPrompt: string;
  openingLine: string;
  resultParseRule: string;
}

const TAGLINES: Record<string, string> = {
  mbti: '了解你的代码',
  bigfive: '探索你的维度',
  enneagram: '发现你的号码',
  disc: '解码你的密码',
  holland: '定位你的方向',
  temper: '找到你的底色',
};

const AI_AVATARS: Record<string, string> = {
  mbti: '🧑‍🔬', bigfive: '📊', enneagram: '🧘',
  disc: '👔', holland: '🧭', temper: '👴',
};

const AI_NAMES: Record<string, string> = {
  mbti: '心理学家小 M', bigfive: '数据分析师小 B', enneagram: '智慧禅师小九',
  disc: '职场教练小 D', holland: '职业向导小霍', temper: '慧眼老者老火',
};

// Confetti pieces for celebration
function Confetti({ color }: { color: string }) {
  return (
    <div className="fp-confetti-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="fp-confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`,
            background: [color, '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff9ff3'][i % 6],
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

export default function AiFortunePark() {
  const { user } = useAuth();

  const [types, setTypes] = useState<AssessmentType[]>([]);
  const [hasKey, setHasKey] = useState(false);
  const [selectedType, setSelectedType] = useState<AssessmentType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [result, setResult] = useState<{ type: string; description?: string } | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [deepDive, setDeepDive] = useState('');
  const [deepDiveLoading, setDeepDiveLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 初始化: 检查 API Key 并加载类型
  useEffect(() => {
    const key = getApiKey();
    if (key) {
      setHasKey(true);
      api.get('/ai-assessment-types').then(res => setTypes(res.data.data)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

  const handleSelectType = (type: AssessmentType) => {
    const msg: Message = { role: 'assistant', content: type.openingLine || '你好呀！我们聊聊天吧！😊' };
    setSelectedType(type);
    setMessages([msg]);
    setResult(null);
    setDeepDive('');
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedType || loading) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    setStreamText('');

    const res = await sendChatMessage(getApiKey(), newMessages, selectedType.sysPrompt, (partial) => {
      setStreamText(partial);
    });

    setLoading(false);

    if (res.ok) {
      setMessages(prev => [...prev, { role: 'assistant', content: res.content }]);
      setStreamText('');

      const hasFinal = res.content.includes('最终判断') || res.content.includes('最终评估');
      if (hasFinal) {
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3000);

        if (selectedType.resultParseRule === 'mbti_4letter') {
          const m = extractMbtiResult(res.content);
          if (m) setResult({ type: m });
        } else {
          setResult({ type: '完成', description: '已完成评估，详情见上方分析。' });
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleDeepDive = async () => {
    if (!selectedType || deepDiveLoading) return;
    setDeepDiveLoading(true);
    const prompt = `用户刚刚完成了评估。请给他们一份简短温暖的解读，200-300字。`;
    const res = await sendChatMessage(getApiKey(), [
      { role: 'system', content: '你是一位温暖的朋友，用第二人称"你"回复。' },
      { role: 'user', content: prompt },
    ], selectedType.sysPrompt);
    if (res.ok) setDeepDive(res.content);
    setDeepDiveLoading(false);
  };

  const handleReset = () => {
    setSelectedType(null);
    setMessages([]);
    setResult(null);
    setDeepDive('');
    setStreamText('');
  };

  const displayMessages = messages.filter(m => m.role !== 'system');

  // 无 API Key 时显示提示
  if (!hasKey) {
    return (
      <div className="fp-page">
        <div className="fp-bg-circles" />
        <div className="fp-container">
          <div className="fp-header">
            <div className="fp-title-row">
              <span className="fp-title-icon">🎪</span>
              <h1>性格游乐园</h1>
            </div>
            <p className="fp-subtitle">和 AI 聊聊天，看看它怎么"算"你！</p>
          </div>
          <div className="fp-nokey">
            <span className="fp-nokey-icon">🔑</span>
            <p>请先在管理后台 → API 设置中配置 DeepSeek API Key</p>
            {user?.role === 'ADMIN' && (
              <a href="/admin/api-settings" className="fp-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>去配置</a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // === Mode Selection Screen ===
  if (!selectedType) {
    return (
      <div className="fp-page">
        <div className="fp-bg-circles" />
        <div className="fp-container">
          <div className="fp-header">
            <div className="fp-title-row">
              <span className="fp-title-icon">🎪</span>
              <h1>性格游乐园</h1>
            </div>
            <p className="fp-subtitle">和 AI 聊聊天，看看它怎么"算"你！选一个摊位开始吧 👇</p>
          </div>

          <div className="fp-grid">
            {types.map(type => (
              <button key={type.id} className="fp-card" style={{ '--card-color': type.color } as React.CSSProperties}
                onClick={() => handleSelectType(type)}>
                <span className="fp-card-icon">{type.icon || '🧠'}</span>
                <span className="fp-card-name">{type.name}</span>
                <span className="fp-card-tagline">{TAGLINES[type.code] || '探索你的性格'}</span>
                <span className="fp-card-desc">{type.description}</span>
                <span className="fp-card-ai">{AI_AVATARS[type.code] || '🤖'} {AI_NAMES[type.code] || 'AI 助手'} 接待</span>
              </button>
            ))}
          </div>

          {user?.role === 'ADMIN' && (
            <div className="fp-admin-bar">
              <a href="/admin/ai-types" className="fp-admin-btn">⚙️ 管理评估类型</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === Chat Screen ===
  const color = selectedType.color || '#667eea';
  return (
    <div className="fp-page fp-chat-page" style={{ '--accent': color } as React.CSSProperties}>
      {celebrating && <Confetti color={color} />}
      <div className="fp-container">
        {/* Chat header */}
        <div className="fp-chat-header">
          <button className="fp-back-btn" onClick={handleReset}>← 返回</button>
          <div className="fp-chat-header-info">
            <span className="fp-chat-avatar">{AI_AVATARS[selectedType.code] || '🤖'}</span>
            <div>
              <span className="fp-chat-name">{AI_NAMES[selectedType.code] || 'AI 助手'}</span>
              <span className="fp-chat-type">{selectedType.icon} {selectedType.name}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="fp-chat-box">
          {displayMessages.map((msg, i) => (
            <div key={i} className={`fp-msg ${msg.role === 'user' ? 'fp-msg-user' : 'fp-msg-ai'}`}>
              {msg.role === 'assistant' && <span className="fp-msg-av">{AI_AVATARS[selectedType.code] || '🤖'}</span>}
              <div className="fp-msg-bubble">
                <div className="fp-msg-c">{renderContent(msg.content)}</div>
              </div>
              {msg.role === 'user' && <span className="fp-msg-av">👤</span>}
            </div>
          ))}

          {loading && (
            <div className="fp-msg fp-msg-ai">
              <span className="fp-msg-av">{AI_AVATARS[selectedType.code] || '🤖'}</span>
              <div className="fp-msg-bubble">
                {streamText ? (
                  <div className="fp-msg-c">{renderContent(streamText)}</div>
                ) : (
                  <div className="fp-typing"><span /><span /><span /></div>
                )}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Result */}
        {result && (
          <div className="fp-result" style={{ borderColor: color }}>
            <div className="fp-result-badge" style={{ background: color }}>🎉 评估完成</div>
            {selectedType.resultParseRule === 'mbti_4letter' && result.type.length === 4 && (
              <div className="fp-result-type" style={{ color }}>{result.type}</div>
            )}
            <div className="fp-result-actions">
              {!deepDive && (
                <button className="fp-btn" style={{ background: color }} onClick={handleDeepDive} disabled={deepDiveLoading}>
                  {deepDiveLoading ? '🔮 解读中...' : '🔮 深度解读'}
                </button>
              )}
              <button className="fp-btn fp-btn-outline" onClick={handleReset}>🔄 重新来</button>
            </div>
            {deepDive && <div className="fp-deepdive">{renderContent(deepDive)}</div>}
          </div>
        )}

        {/* Input */}
        <div className="fp-input-bar">
          <textarea className="fp-input" placeholder={loading ? 'AI 正在回复...' : '输入你的回答...'}
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            disabled={loading || !!result} rows={1} />
          <button className="fp-send-btn" style={{ background: color }}
            onClick={handleSend} disabled={!input.trim() || loading || !!result}>发送</button>
        </div>
      </div>
    </div>
  );
}

function renderContent(text: string) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="fp-bold">{line.slice(2, -2)}</p>;
    if (line.startsWith('- ')) return <li key={i} className="fp-li">{line.slice(2)}</li>;
    if (line.startsWith('（') && (line.includes('当前判断') || line.includes('最终判断') || line.includes('当前评估') || line.includes('最终评估') || line.includes('信心度'))) return null;
    if (line.trim() === '') return <br key={i} />;
    return <p key={i}>{line}</p>;
  });
}
