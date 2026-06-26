import React from 'react';
import { Link } from 'react-router-dom';
import '@/components/Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container page-transition">
      <div className="hero-section">
        <h1>MBTI性格测试与就业推荐系统</h1>
        <p>了解你的性格类型，发现最适合你的职业方向</p>
        <div className="cta-buttons">
          <Link to="/test" className="primary-button">开始测试</Link>
          <Link to="/liuyao" className="secondary-button">易经测试</Link>
          <Link to="/about" className="secondary-button">了解更多</Link>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <h3>🧪 科学的性格评估</h3>
          <p>基于经典MBTI理论，通过精心设计的题目，准确评估你的性格类型</p>
        </div>
        <div className="feature-card">
          <h3>📊 详细的性格分析</h3>
          <p>获得全面的性格报告，了解你的优势、劣势和适合的发展方向</p>
        </div>
        <div className="feature-card">
          <h3>🎯 个性化就业推荐</h3>
          <p>根据你的性格类型，推荐最适合你的职业和专业方向</p>
        </div>
        <div className="feature-card">
          <h3>🔮 易经测试</h3>
          <p>结合传统易经六十四卦，以交象推演你的MBTI性格类型，体验古老智慧与现代心理学的融合</p>
        </div>
      </div>
    </div>
  );
};

export default Home;