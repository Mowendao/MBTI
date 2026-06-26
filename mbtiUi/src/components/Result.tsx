import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import html2pdf from 'html2pdf.js';
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

  const TYPE_COLORS: Record<string, string> = {
    ISTJ: '#4A90D9', ISFJ: '#7B9BA6', INFJ: '#9B59B6', INTJ: '#2C3E50',
    ISTP: '#27AE60', ISFP: '#E67E22', INFP: '#E91E8A', INTP: '#3498DB',
    ESTP: '#F39C12', ESFP: '#FF6B6B', ENFP: '#FF9FF3', ENTP: '#00CEC9',
    ESTJ: '#2ECC71', ESFJ: '#FD79A8', ENFJ: '#6C5CE7', ENTJ: '#E74C3C',
  };

  const [showShare, setShowShare] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
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
  const shareUrl = `${window.location.origin}/share?type=${type}` +
    `&E=${Math.round(percentage.E)}&I=${Math.round(percentage.I)}` +
    `&S=${Math.round(percentage.S)}&N=${Math.round(percentage.N)}` +
    `&T=${Math.round(percentage.T)}&F=${Math.round(percentage.F)}` +
    `&J=${Math.round(percentage.J)}&P=${Math.round(percentage.P)}`;

  const handleShare = () => setShowShare(true);

  const handleDownloadPoster = () => {
    if (!posterRef.current) return;
    html2pdf().from(posterRef.current).set({
      margin: 0,
      filename: `MBTI_${type}_海报.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    }).save();
  };

  return (
    <div className="result-page"><div className="result-container page-transition">
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
          📤 分享海报
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

      {/* 分享海报弹窗 */}
      {showShare && (
        <div className="qr-modal-overlay" onClick={() => setShowShare(false)}>
          <div className="qr-modal share-modal" onClick={e => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={() => setShowShare(false)}>✕</button>
            <h2>分享你的 MBTI 结果</h2>

            {/* 海报预览 */}
            <div className="poster-preview" ref={posterRef} style={{ '--accent': TYPE_COLORS[type] || '#667eea', '--accent-dark': (TYPE_COLORS[type] || '#667eea') + 'b3' } as React.CSSProperties}>
              <div className="pp-wave" />
              <div className="pp-inner">
                <div className="pp-badge">MBTI 性格测试</div>
                <div className="pp-type">{type}</div>
                <div className="pp-desc">{description}</div>
                <div className="pp-divider" />
                {Object.entries(percentage).reduce((acc, _entry, i, arr) => {
                  if (i % 2 === 0) {
                    const left = arr[i];
                    const right = arr[i + 1];
                    if (!right) return acc;
                    const label = ({ E: 'E/I', S: 'S/N', T: 'T/F', J: 'J/P' } as any)[left[0]] || '';
                    acc.push({ label, leftPct: left[1], rightPct: right[1] });
                  }
                  return acc;
                }, [] as { label: string; leftPct: number; rightPct: number }[]).map((d, i) => (
                  <div key={i} className="pp-dim" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ width: 36, fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', textAlign: 'right', flexShrink: 0 }}>{d.label}</span>
                    <div style={{ flex: 1, display: 'flex', height: 20, borderRadius: 10, overflow: 'hidden', background: '#f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', color: '#fff', fontSize: '0.6rem', fontWeight: 600, width: `${d.leftPct}%`, minWidth: 0 }}>{d.leftPct > 15 && `${Math.round(d.leftPct)}%`}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e8e8', color: '#aaa', fontSize: '0.6rem', fontWeight: 600, width: `${d.rightPct}%`, minWidth: 0 }}>{d.rightPct > 15 && `${Math.round(d.rightPct)}%`}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pp-footer">MBTI 性格测试与就业推荐系统</div>
            </div>

            {/* 二维码 */}
            <div className="share-row">
              <div className="share-qr-wrap">
                <QRCodeSVG value={shareUrl} size={100} level="M" />
              </div>
              <div className="share-dl-wrap">
                <button className="poster-btn primary" onClick={handleDownloadPoster}>📥 保存 PDF</button>
                <span className="share-hint">微信扫码也可自动下载 PDF</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Result;