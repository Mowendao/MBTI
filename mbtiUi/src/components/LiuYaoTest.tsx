import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { liuYaoQuestions, liuYaoCareerQuestions } from '@/data/liuyaoHexagrams';
import { calculateLiuYao, randomDivination, type YaoType, type LiuYaoMode } from '@/utils/liuyao';
import './LiuYao.css';

type Phase = 'mode_select' | 'question_input' | 'test' | 'shaking';

export default function LiuYaoTest() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('mode_select');
  const [mode, setMode] = useState<LiuYaoMode>('career');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<YaoType[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [shakeCount, setShakeCount] = useState(0);

  // 选择模式
  const selectMode = (m: LiuYaoMode) => {
    setMode(m);
    if (m === 'career') {
      setPhase('test');
    } else {
      setPhase('question_input');
    }
  };

  // 当前题目集
  const questions = mode === 'career' ? liuYaoCareerQuestions : liuYaoQuestions;
  const current = questions[step];

  // 回答问题（职业/性格测试模式）
  const handleSelect = (type: YaoType) => {
    const newAnswers = [...answers, type];
    if (step < questions.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      const result = calculateLiuYao(newAnswers, mode);
      sessionStorage.setItem('liuyaoResult', JSON.stringify(result));
      navigate('/liuyao-result', { state: { result } });
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setAnswers(answers.slice(0, -1));
      setStep(step - 1);
    }
  };

  // 问卦模式：提交问题后开始摇卦
  const handleSubmitQuestion = () => {
    if (!userQuestion.trim()) return;
    setPhase('shaking');
    setShakeCount(0);
    // 模拟摇卦动画（6次投掷，每次间隔600ms）
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setShakeCount(count);
      if (count >= 6) {
        clearInterval(interval);
        setTimeout(() => {
          const result = randomDivination(userQuestion.trim());
          sessionStorage.setItem('liuyaoResult', JSON.stringify(result));
          navigate('/liuyao-result', { state: { result } });
        }, 500);
      }
    }, 600);
  };

  // ===== 模式选择页 =====
  if (phase === 'mode_select') {
    return (
      <div className="liuyao-container page-transition">
        <div className="liuyao-header">
          <h1>☯️ 六爻 · 易经智慧</h1>
          <p className="liuyao-subtitle">选择你感兴趣的测试方式</p>
        </div>

        <div className="liuyao-mode-grid">
          <div className="liuyao-mode-card" onClick={() => selectMode('career')}>
            <div className="mode-icon">🧭</div>
            <h3>职业性格测试</h3>
            <p>通过 6 道职场情境题，揭示你的职业性格特质、工作风格和潜在优势</p>
            <span className="mode-tag">6 道题 · 约 2 分钟</span>
          </div>

          <div className="liuyao-mode-card" onClick={() => selectMode('divination')}>
            <div className="mode-icon">🔮</div>
            <h3>问卦占卜</h3>
            <p>在心中默念你的问题，让易经六爻为你指点迷津，AI 智慧师为你解读卦象</p>
            <span className="mode-tag">自由提问 · AI 解读</span>
          </div>
        </div>

        <div className="liuyao-mode-footer">
          <p>💡 两种模式都可以获得 AI 深度分析，需要先配置 API Key</p>
        </div>
      </div>
    );
  }

  // ===== 问卦模式：输入问题 =====
  if (phase === 'question_input') {
    return (
      <div className="liuyao-container page-transition">
        <div className="liuyao-header">
          <h1>🔮 问卦 · 请说出你的困惑</h1>
          <p className="liuyao-subtitle">在心中专注地想着你的问题，然后写下来</p>
        </div>

        <div className="liuyao-question-input-card">
          <div className="question-input-icon">❓</div>
          <textarea
            className="liuyao-question-textarea"
            placeholder="例如：我应该接受这份新工作吗？&#10;例如：我的创业方向是否正确？&#10;例如：这段合作关系该如何处理？"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            rows={4}
          />
          <p className="question-input-hint">
            ✨ 问题越具体，卦象解读越准确。建议描述你当前面临的具体情境和困惑。
          </p>
          <div className="question-input-actions">
            <button className="liuyao-nav-btn" onClick={() => setPhase('mode_select')}>
              ← 返回选择
            </button>
            <button
              className="liuyao-divine-btn"
              onClick={handleSubmitQuestion}
              disabled={!userQuestion.trim()}
            >
              🎴 开始摇卦
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== 摇卦动画 =====
  if (phase === 'shaking') {
    return (
      <div className="liuyao-container page-transition">
        <div className="liuyao-header">
          <h1>🎴 摇卦中...</h1>
          <p className="liuyao-subtitle">心诚则灵，卦象正在生成</p>
        </div>

        <div className="liuyao-shaking-animation">
          <div className={`shaking-coins ${shakeCount > 0 ? 'active' : ''}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`coin-yao ${i < shakeCount ? 'revealed' : 'hidden'}`}>
                {i < shakeCount ? (
                  <span className="coin-result">
                    {['⚊', '⚋'][Math.floor(Math.random() * 2)]}
                  </span>
                ) : (
                  <span className="coin-pending">⚬</span>
                )}
              </div>
            ))}
          </div>
          <div className="shaking-progress">
            <p>第 <strong>{shakeCount}</strong> / 6 爻</p>
            <div className="shaking-bar">
              <div className="shaking-bar-fill" style={{ width: `${(shakeCount / 6) * 100}%` }} />
            </div>
          </div>
          <p className="shaking-question">「{userQuestion}」</p>
        </div>
      </div>
    );
  }

  // ===== 答题模式（职业性格测试） =====
  return (
    <div className="liuyao-container page-transition">
      <div className="liuyao-header">
        <h1>{mode === 'career' ? '🧭 六爻 · 职业性格测试' : '⚡ 六爻 · 易经性格测试'}</h1>
        <p className="liuyao-subtitle">
          {mode === 'career'
            ? '回答 6 道职场情境题，揭示你的职业性格密码'
            : '回答 6 道情境题，每一爻揭示你性格的一个维度'}
        </p>
      </div>

      {/* 进度 */}
      <div className="liuyao-progress">
        {questions.map((_, i) => (
          <div key={i} className={`liuyao-progress-dot ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
            <span className="liuyao-dot-inner">{i < step ? '✓' : i + 1}</span>
          </div>
        ))}
      </div>

      {/* 题目卡片 */}
      <div className="liuyao-question-card" key={step}>
        <div className="liuyao-question-badge">{current.title}</div>
        <p className="liuyao-scenario">{current.scenario}</p>

        <div className="liuyao-options">
          {current.options.map((opt, i) => (
            <button key={i} className="liuyao-option" onClick={() => handleSelect(opt.type)}>
              <span className="liuyao-option-label">{opt.label}</span>
              <span className="liuyao-option-text">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 导航 */}
      <div className="liuyao-nav">
        {step > 0 ? (
          <button className="liuyao-nav-btn" onClick={handlePrev}>← 上一题</button>
        ) : (
          <button className="liuyao-nav-btn" onClick={() => setPhase('mode_select')}>← 返回</button>
        )}
        <span className="liuyao-step-indicator">{step + 1} / {questions.length}</span>
      </div>

      {/* 已选概览 */}
      <div className="liuyao-preview">
        <div className="liuyao-yao-strip">
          {answers.map((a, i) => (
            <span key={i} className={`liuyao-yao-tag ${a === 'old_yang' || a === 'young_yang' ? 'yang' : 'yin'}`}>
              {a === 'old_yang' ? '○' : a === 'young_yang' ? '—' : a === 'young_yin' ? '- -' : 'X'}
            </span>
          ))}
          {Array.from({ length: questions.length - answers.length }).map((_, i) => (
            <span key={i + answers.length} className="liuyao-yao-tag empty">⚬</span>
          ))}
        </div>
        <p className="liuyao-preview-label">已选 / 共 6 爻</p>
      </div>
    </div>
  );
}
