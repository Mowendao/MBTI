import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-container page-transition">
      <h1>关于MBTI性格测试</h1>
      
      <div className="about-section">
        <h2>什么是MBTI？</h2>
        <p>MBTI（Myers-Briggs Type Indicator）是一种基于卡尔·荣格心理学理论的性格评估工具，由伊莎贝尔·迈尔斯和凯瑟琳·布里格斯开发。它通过四个维度来描述人的性格类型：</p>
        <ul>
          <li><strong>外向(E) vs 内向(I)</strong>：你如何获取能量</li>
          <li><strong>感觉(S) vs 直觉(N)</strong>：你如何获取信息</li>
          <li><strong>思考(T) vs 情感(F)</strong>：你如何做决定</li>
          <li><strong>判断(J) vs 感知(P)</strong>：你如何组织生活</li>
        </ul>
      </div>
      
      <div className="about-section">
        <h2>为什么要做MBTI测试？</h2>
        <p>MBTI测试可以帮助你：</p>
        <ul>
          <li>更好地了解自己的性格特点和偏好</li>
          <li>发现自己的优势和潜在的发展领域</li>
          <li>理解不同性格类型的人如何思考和行为</li>
          <li>为职业选择和个人发展提供参考</li>
        </ul>
      </div>
      
      <div className="about-section">
        <h2>关于本系统</h2>
        <p>本系统基于经典MBTI理论，通过20道精心设计的题目，帮助你了解自己的性格类型，并根据你的性格特点推荐适合的职业方向。</p>
        <p>测试结果仅供参考，不能完全定义你的能力和潜力。每个人都是独特的，性格类型只是了解自己的一个工具。</p>
      </div>
      
      <div className="about-cta">
        <Link to="/test" className="primary-button">开始测试</Link>
        <Link to="/" className="secondary-button">返回首页</Link>
      </div>
    </div>
  );
};

export default About;