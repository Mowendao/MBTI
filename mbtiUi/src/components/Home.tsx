import { Link } from 'react-router-dom';
import './Home.css';

const FUN_FEATURES = [
  { icon: '🧪', title: '标准测试', desc: '20道经典MBTI题，测完就知道你是"快乐修勾"还是"暴君CEO"', link: '/test', color: '#667eea' },
  { icon: '🎪', title: '性格游乐园', desc: '和AI聊天就能"算"出你的人格类型，试试九型、DISC、气质...', link: '/fortune-park', color: '#9B59B6' },
  { icon: '🧩', title: '人格游乐园', desc: '戳戳16种人格卡片，看看你的性格和谁最来电～', link: '/explore', color: '#E91E8A' },
  { icon: '🎨', title: '气质画廊', desc: '每种人格都有专属配色和元素，看看你的气质底色是什么', link: '/gallery', color: '#00CEC9' },
  { icon: '🔮', title: '易经测试', desc: '摇一卦，六爻推演你的MBTI，老祖宗的智慧给你算一卦', link: '/liuyao', color: '#F39C12' },
  { icon: '📤', title: '海报送你', desc: '测完一键生成精美海报+PDF，朋友圈晒起来！', link: '/test', color: '#2ECC71' },
];

const RANDOM_TAGLINES = [
  '你是"社交霸王龙"还是"神秘哲学家"？',
  '测过都说准，不准...那再测一次！',
  '比星座准多了（小声bb）',
  'GPT 看了都说好 🤖',
  '自从做了这个测试，我原谅了自己所有的缺点',
];

export default function Home() {
  const tagline = RANDOM_TAGLINES[Math.floor(Math.random() * RANDOM_TAGLINES.length)];

  return (
    <div className="hm-page">
      <div className="hm-bg-circles" />
      <div className="hm-container">
        {/* Hero */}
        <div className="hm-hero">
          <div className="hm-hero-badge">🔥 全网最好玩的性格测试</div>
          <h1 className="hm-hero-title">
            这<em>不是</em>一般的 MBTI
            <span className="hm-hero-sparkle">✨</span>
          </h1>
          <p className="hm-hero-sub">{tagline}</p>
          <div className="hm-hero-actions">
            <Link to="/test" className="hm-btn hm-btn-primary">🚀 开始测试</Link>
            <Link to="/fortune-park" className="hm-btn hm-btn-secondary">🎪 去游乐园</Link>
          </div>
        </div>

        {/* Floating stats */}
        <div className="hm-stats">
          <div className="hm-stat">
            <span className="hm-stat-num">16</span>
            <span className="hm-stat-label">种人格类型</span>
          </div>
          <div className="hm-stat">
            <span className="hm-stat-num">6</span>
            <span className="hm-stat-label">种评估体系</span>
          </div>
          <div className="hm-stat">
            <span className="hm-stat-num">∞</span>
            <span className="hm-stat-label">种有趣发现</span>
          </div>
        </div>

        {/* Feature cards */}
        <div className="hm-grid">
          {FUN_FEATURES.map((f, i) => (
            <Link key={i} to={f.link} className="hm-card" style={{ '--accent': f.color } as React.CSSProperties}>
              <span className="hm-card-icon">{f.icon}</span>
              <span className="hm-card-title">{f.title}</span>
              <span className="hm-card-desc">{f.desc}</span>
              <span className="hm-card-go" style={{ background: f.color }}>Go →</span>
            </Link>
          ))}
        </div>

        {/* Bottom banner */}
        <div className="hm-banner">
          <span className="hm-banner-icon">🤝</span>
          <span className="hm-banner-text">V我50，帮你分析人格（开玩笑的，免费！）</span>
        </div>
      </div>
    </div>
  );
}
