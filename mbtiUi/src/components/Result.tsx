import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TestResult } from '@/types/mbti';
import { getMBTIDescription } from '@/utils/mbti';
import { generatePersonalityReport } from '@/utils/personalityAnalysis';
import { getCareerRecommendations } from '@/utils/careerRecommendation';
import { generateMBTIReport, downloadReport } from '@/utils/reportGenerator';
import { analyzePersonality, getApiKey } from '@/services/aiService';
import '@/components/Result.css';

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 优先从路由状态读取，否则从 sessionStorage 恢复（支持刷新）
  const stateResult = (location.state as { result: TestResult } | null)?.result;
  const [result, setResult] = useState<TestResult | null>(stateResult ?? null);

  useEffect(() => {
    if (!result) {
      const saved = sessionStorage.getItem('lastTestResult');
      if (saved) {
        setResult(JSON.parse(saved));
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const { type, percentage } = result;
  const description = getMBTIDescription(type);
  const personalityReport = generatePersonalityReport(result);
  const recommendedCareers = getCareerRecommendations(type);

  const dimensions: { name: string; primary: keyof typeof percentage; secondary: keyof typeof percentage }[] = [
    { name: '外向(E) vs 内向(I)', primary: 'E', secondary: 'I' },
    { name: '感觉(S) vs 直觉(N)', primary: 'S', secondary: 'N' },
    { name: '思考(T) vs 情感(F)', primary: 'T', secondary: 'F' },
    { name: '判断(J) vs 感知(P)', primary: 'J', secondary: 'P' }
  ];

  const [copied, setCopied] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAiAnalysis = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setAiError('请先在管理后台「API 设置」中配置 DeepSeek API Key');
      return;
    }
    setAiLoading(true);
    setAiError('');
    setAiAnalysis('');
    const res = await analyzePersonality(result, apiKey);
    setAiLoading(false);
    if (res.ok) {
      setAiAnalysis(res.analysis);
    } else {
      setAiError(res.error);
    }
  };
  const handleShare = () => {
    const text = `我的 MBTI 测试结果: ${type} - ${description}\n\n` +
      `E: ${percentage.E}% | I: ${percentage.I}%\n` +
      `S: ${percentage.S}% | N: ${percentage.N}%\n` +
      `T: ${percentage.T}% | F: ${percentage.F}%\n` +
      `J: ${percentage.J}% | P: ${percentage.P}%\n\n` +
      `来自 MBTI 性格测试与就业推荐系统`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
              {recommendedCareers.slice(0, 5).map((career) => (
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
        <button className="action-button" onClick={() => navigate('/test')}>
          重新测试
        </button>
        <button className="action-button secondary" onClick={() => navigate('/history')}>
          历史记录
        </button>
        <button className="action-button secondary" onClick={handleShare}>
          {copied ? '已复制!' : '分享结果'}
        </button>
        <button className="action-button" onClick={() => {
          const html = generateMBTIReport(result);
          downloadReport(html, `MBTI报告_${type}_${new Date().toLocaleDateString('zh-CN')}.html`);
        }}>
          📥 下载报告
        </button>
        <button
          className="action-button ai-btn"
          onClick={handleAiAnalysis}
          disabled={aiLoading}
        >
          {aiLoading ? '🤖 AI 分析中...' : '🤖 AI 深度洞察'}
        </button>
      </div>

      {(aiLoading || aiAnalysis || aiError) && (
        <div className="ai-analysis-section">
          <h2>🤖 AI 深度洞察</h2>
          {aiLoading && (
            <div className="ai-loading">
              <div className="ai-loading-dots">
                <span /><span /><span />
              </div>
              <p>AI 正在分析你的性格特质，请稍候...</p>
            </div>
          )}
          {aiError && (
            <div className="ai-error">
              <p>{aiError}</p>
            </div>
          )}
          {aiAnalysis && (
            <div className="ai-result-content">
              {aiAnalysis.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return <h3 key={i}>{line.replace('## ', '')}</h3>;
                }
                if (line.trim() === '') return <br key={i} />;
                return <p key={i}>{line}</p>;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Result;