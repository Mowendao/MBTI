import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TestResult } from '../types/mbti';
import { getMBTIDescription } from '../utils/mbti';
import { generatePersonalityReport } from '../utils/personalityAnalysis';
import { getCareerRecommendations } from '../utils/careerRecommendation';
import './Result.css';

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state as { result: TestResult };

  if (!result) {
    navigate('/');
    return null;
  }

  const { type, percentage } = result;
  const description = getMBTIDescription(type);
  const personalityReport = generatePersonalityReport(result);
  const recommendedCareers = getCareerRecommendations(type);

  const dimensions = [
    { name: '外向(E) vs 内向(I)', primary: 'E', secondary: 'I' },
    { name: '感觉(S) vs 直觉(N)', primary: 'S', secondary: 'N' },
    { name: '思考(T) vs 情感(F)', primary: 'T', secondary: 'F' },
    { name: '判断(J) vs 感知(P)', primary: 'J', secondary: 'P' }
  ];

  return (
    <div className="result-container page-transition">
      <div className="result-header">
        <h1>你的MBTI性格类型</h1>
        <div className="type-card">
          <h2 className="type-code">{type}</h2>
          <p className="type-description">{description}</p>
        </div>
      </div>
      
      <div className="analysis-section">
        <h2>性格维度分析</h2>
        <div className="dimension-container">
          {dimensions.map((dimension, index) => (
            <div key={index} className="dimension-card">
              <h3>{dimension.name}</h3>
              <div className="dimension-bar">
                <div 
                  className="dimension-fill primary"
                  style={{ width: `${percentage[dimension.primary]}%` }}
                >
                  {dimension.primary} ({percentage[dimension.primary]}%)
                </div>
                <div 
                  className="dimension-fill secondary"
                  style={{ width: `${percentage[dimension.secondary]}%` }}
                >
                  {dimension.secondary} ({percentage[dimension.secondary]}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="personality-section">
        <h2>性格分析报告</h2>
        <div className="insight-cards">
          <div className="insight-card">
            <h3>{personalityReport.strengths.title}</h3>
            <p>{personalityReport.strengths.description}</p>
            <ul>
              {personalityReport.strengths.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="insight-card">
            <h3>{personalityReport.weaknesses.title}</h3>
            <p>{personalityReport.weaknesses.description}</p>
            <ul>
              {personalityReport.weaknesses.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="insight-card">
            <h3>{personalityReport.learningStyle.title}</h3>
            <p>{personalityReport.learningStyle.description}</p>
            <ul>
              {personalityReport.learningStyle.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="insight-card">
            <h3>{personalityReport.careerFit.title}</h3>
            <p>{personalityReport.careerFit.description}</p>
            <ul>
              {personalityReport.careerFit.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="insight-card">
            <h3>{personalityReport.relationshipStyle.title}</h3>
            <p>{personalityReport.relationshipStyle.description}</p>
            <ul>
              {personalityReport.relationshipStyle.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="career-section">
        <h2>推荐职业方向</h2>
        <div className="career-cards">
          <div className="career-card">
            <h3>适合的职业</h3>
            <ul>
              {recommendedCareers.slice(0, 5).map((career, index) => (
                <li key={career.id}>{career.name}</li>
              ))}
            </ul>
          </div>
          <div className="career-card">
            <h3>发展建议</h3>
            <ul>
              {personalityReport.careerFit.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="career-details">
          <h3>职业详情</h3>
          <div className="career-grid">
            {recommendedCareers.slice(0, 3).map((career) => (
              <div key={career.id} className="career-item">
                <h4>{career.name}</h4>
                <p>{career.description}</p>
                <div className="career-info">
                  <p><strong>所需技能：</strong>{career.skills.join(', ')}</p>
                  <p><strong>教育背景：</strong>{career.education.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="action-button" 
          onClick={() => navigate('/test')}
        >
          重新测试
        </button>
        <button 
          className="action-button secondary" 
          onClick={() => navigate('/')}
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default Result;