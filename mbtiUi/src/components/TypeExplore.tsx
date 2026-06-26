import { useState } from 'react';
import type { MBTIType } from '@/types/mbti';
import { getTypeProfile, TYPE_COLORS, famousPeopleByType } from '@/data/typeProfiles';
import { calculateMatch, getAdvice } from '@/utils/typeMatching';
import './TypeExplore.css';

const GRID_ROWS: MBTIType[][] = [
  ['ISTJ', 'ISFJ', 'INFJ', 'INTJ'],
  ['ISTP', 'ISFP', 'INFP', 'INTP'],
  ['ESTP', 'ESFP', 'ENFP', 'ENTP'],
  ['ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'],
];

const TYPE_EMOJIS: Record<string, string> = {
  ISTJ: '🏛️', ISFJ: '🛡️', INFJ: '🔮', INTJ: '♟️',
  ISTP: '🔧', ISFP: '🎨', INFP: '🦋', INTP: '🧪',
  ESTP: '🔥', ESFP: '🌟', ENFP: '🌈', ENTP: '💡',
  ESTJ: '📋', ESFJ: '🤗', ENFJ: '👑', ENTJ: '🚀',
};

const FUN_TAGS: Record<string, string> = {
  ISTJ: '行走的日历', ISFJ: '人间暖宝宝', INFJ: '神秘哲学家', INTJ: '幕后大 Boss',
  ISTP: '万能修理工', ISFP: '温柔小画家', INFP: '做梦专业户', INTP: '人形维基百科',
  ESTP: '社交霸王龙', ESFP: '派对永动机', ENFP: '快乐修勾', ENTP: '杠精十级学者',
  ESTJ: '效率狂魔', ESFJ: '贴心大管家', ENFJ: '人间充电宝', ENTJ: '暴君CEO',
};

function TypeCard({ type, selected, onClick }: { type: MBTIType; selected?: 'first' | 'second' | false; onClick: () => void }) {
  const color = TYPE_COLORS[type];
  const profile = getTypeProfile(type);
  return (
    <button className={`txc-card ${selected || ''}`} style={{ '--card-color': color } as React.CSSProperties} onClick={onClick}>
      <span className="txc-emoji">{TYPE_EMOJIS[type] || '🧠'}</span>
      <span className="txc-code">{type}</span>
      <span className="txc-fun">{FUN_TAGS[type] || profile.title}</span>
      {selected === 'first' && <span className="txc-badge tcb-a">✅ 选我</span>}
      {selected === 'second' && <span className="txc-badge tcb-b">🆚 对比</span>}
    </button>
  );
}

function MatchMeter({ label, value }: { label: string; value: number }) {
  const emoji = value >= 80 ? '💖' : value >= 60 ? '💛' : '💔';
  const color = value >= 80 ? '#2ECC71' : value >= 60 ? '#F39C12' : '#E74C3C';
  return (
    <div className="mm-row">
      <span className="mm-label">{emoji} {label}</span>
      <div className="mm-bar-wrap">
        <div className="mm-bar-fill" style={{ width: `${value}%`, background: color }} />
        <span className="mm-bar-text">{value}%</span>
      </div>
    </div>
  );
}

export default function TypeExplore() {
  const [first, setFirst] = useState<MBTIType | null>(null);
  const [second, setSecond] = useState<MBTIType | null>(null);
  const [showTip, setShowTip] = useState(true);

  const handleClick = (type: MBTIType) => {
    if (!first || type === first) { setFirst(type); setSecond(null); }
    else if (!second) { setSecond(type); }
    else if (type === second) { const s = first; setFirst(second); setSecond(s); }
    else { setFirst(type); setSecond(null); }
    setShowTip(false);
  };

  const isCompare = first && second;
  const match = isCompare ? calculateMatch(first, second) : null;
  const advice = isCompare && match ? getAdvice(first, second, match) : [];
  const p1 = first ? getTypeProfile(first) : null;
  const p2 = second ? getTypeProfile(second) : null;

  return (
    <div className="tx-page">
      <div className="tx-bg-circles" />
      <div className="tx-container">
        {/* Header */}
        <div className="tx-header">
          <div className="tx-header-content">
            <span className="tx-header-icon">🧩</span>
            <h1>人格游乐园</h1>
            <p>戳戳卡片，看看你的性格和谁最来电！<span className="tx-header-fun">🤝 快来配对吧！</span></p>
          </div>
        </div>

        {/* Floating hint */}
        {showTip && !first && (
          <div className="tx-tip">
            <span className="tx-tip-icon">👉</span>
            <span>点击任意卡片看看它的秘密人格档案～再点一个就能 PK 啦！</span>
          </div>
        )}

        {/* 4x4 Grid */}
        <div className="txc-grid">
          {GRID_ROWS.map((row, ri) => (
            <div key={ri} className="txc-row">
              {row.map(type => (
                <TypeCard key={type} type={type} selected={first === type ? 'first' : second === type ? 'second' : false} onClick={() => handleClick(type)} />
              ))}
            </div>
          ))}
        </div>

        {/* Selection status */}
        {(first || second) && (
          <div className="tx-status">
            <span className="tx-status-item">{first ? `✅ ${first} ${FUN_TAGS[first] || ''}` : '⬜ 选择第一个类型'}</span>
            <span className="tx-status-vs">⚡</span>
            <span className="tx-status-item">{second ? `✅ ${second} ${FUN_TAGS[second] || ''}` : '⬜ 再点一个来对比'}</span>
          </div>
        )}

        {/* Panel */}
        <div className="tx-panel">
          {!first && (
            <div className="tx-empty">
              <span className="tx-empty-icon">🔍</span>
              <p>选一个人格小人都等不及要介绍自己啦！</p>
            </div>
          )}

          {/* Single type detail */}
          {first && !second && p1 && (
            <div className="tx-detail">
              <div className="tx-hero" style={{ '--hero': TYPE_COLORS[first] } as React.CSSProperties}>
                <span className="tx-hero-emoji">{TYPE_EMOJIS[first]}</span>
                <span className="tx-hero-type">{first}</span>
                <span className="tx-hero-fun">{FUN_TAGS[first]}</span>
                <span className="tx-hero-title">{p1.title}</span>
                <span className="tx-hero-quote">{famousPeopleByType[first]}</span>
              </div>
              <div className="tx-body">
                <p className="tx-desc">{p1.description}</p>

                <div className="tx-grid-2">
                  <div className="tx-info-card tx-info-green">
                    <span className="tx-info-icon">💪</span>
                    <h4>天生我才</h4>
                    <ul>{p1.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                  <div className="tx-info-card tx-info-red">
                    <span className="tx-info-icon">🌱</span>
                    <h4>升级空间</h4>
                    <ul>{p1.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                </div>

                <div className="tx-grid-2">
                  <div className="tx-info-card">
                    <span className="tx-info-icon">💬</span>
                    <h4>聊天风格</h4>
                    <p>{p1.communication}</p>
                  </div>
                  <div className="tx-info-card">
                    <span className="tx-info-icon">💼</span>
                    <h4>适合干啥</h4>
                    <div className="tx-tags">{p1.careers.map(c => <span key={c} className="tx-tag">{c}</span>)}</div>
                  </div>
                </div>

                <div className="tx-info-card">
                  <span className="tx-info-icon">🌟</span>
                  <h4>大佬校友</h4>
                  <div className="tx-tags">{p1.famousPeople.map(f => <span key={f} className="tx-tag tx-tag-famous">{f}</span>)}</div>
                </div>

                <div className="tx-hint">👆 再戳一个类型，看看他俩 PK 谁赢！</div>
              </div>
            </div>
          )}

          {/* Comparison */}
          {isCompare && p1 && p2 && match && (
            <div className="tx-compare">
              <h2 className="tx-cmp-title">⚡ {first} {TYPE_EMOJIS[first]} vs {TYPE_EMOJIS[second]} {second} ⚡</h2>
              <p className="tx-cmp-subtitle">看看这俩人凑一起会怎样...</p>

              {/* Side by side */}
              <div className="tx-cmp-cols">
                <div className="tx-cmp-card">
                  <div className="tx-cmp-hero" style={{ '--c': TYPE_COLORS[first] } as React.CSSProperties}>
                    <span className="tx-cmp-emoji">{TYPE_EMOJIS[first]}</span>
                    <span className="tx-cmp-type">{first}</span>
                    <span className="tx-cmp-fun">{FUN_TAGS[first]}</span>
                  </div>
                  <div className="tx-cmp-body">
                    <h5>💪 绝活</h5>
                    {p1.strengths.slice(0, 3).map(s => <div key={s} className="tx-cmp-bullet">✓ {s}</div>)}
                    <h5>🌟 名人</h5>
                    <div className="tx-tags">{p1.famousPeople.slice(0, 3).map(f => <span key={f} className="tx-tag tx-tag-famous">{f}</span>)}</div>
                  </div>
                </div>
                <div className="tx-cmp-vs">
                  <span className="tx-vs-text">VS</span>
                </div>
                <div className="tx-cmp-card">
                  <div className="tx-cmp-hero" style={{ '--c': TYPE_COLORS[second] } as React.CSSProperties}>
                    <span className="tx-cmp-emoji">{TYPE_EMOJIS[second]}</span>
                    <span className="tx-cmp-type">{second}</span>
                    <span className="tx-cmp-fun">{FUN_TAGS[second]}</span>
                  </div>
                  <div className="tx-cmp-body">
                    <h5>💪 绝活</h5>
                    {p2.strengths.slice(0, 3).map(s => <div key={s} className="tx-cmp-bullet">✓ {s}</div>)}
                    <h5>🌟 名人</h5>
                    <div className="tx-tags">{p2.famousPeople.slice(0, 3).map(f => <span key={f} className="tx-tag tx-tag-famous">{f}</span>)}</div>
                  </div>
                </div>
              </div>

              {/* Match scores */}
              <div className="tx-cmp-section">
                <h3>💞 默契度大比拼</h3>
                <div className="tx-matches">
                  <MatchMeter label="总体" value={match.overall} />
                  <MatchMeter label="友谊" value={match.friendship} />
                  <MatchMeter label="恋爱" value={match.romance} />
                  <MatchMeter label="工作" value={match.work} />
                  <MatchMeter label="沟通" value={match.communication} />
                </div>
              </div>

              {/* Advice */}
              <div className="tx-cmp-section">
                <h3>💌 相处秘籍</h3>
                <div className="tx-advice">
                  {advice.map((a, i) => (
                    <div key={i} className="tx-advice-item">
                      <span className="tx-advice-num">#{i + 1}</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
