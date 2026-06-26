import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateLiuYaoAnalysis, type LiuYaoResult as LiuYaoResultType } from '@/utils/liuyao';
import { generateLiuYaoReport, downloadReport } from '@/utils/reportGenerator';
import { analyzeLiuYaoPersonality, getApiKey } from '@/services/aiService';
import './LiuYao.css';

// 单条爻的图形
function YaoLine({ isYang, isChanging, label }: { isYang: boolean; isChanging: boolean; label?: string }) {
  return (
    <div className={`yao-line ${isYang ? 'yang' : 'yin'} ${isChanging ? 'changing' : ''}`}>
      {isYang ? (
        <div className="yao-bar yang-bar" />
      ) : (
        <div className="yao-bar yin-bar">
          <span className="yin-seg" /><span className="yin-gap" /><span className="yin-seg" />
        </div>
      )}
      {label && <span className="yao-label">{label}</span>}
    </div>
  );
}

function HexagramDisplay({ binary, label }: { binary: string; label: string }) {
  const bits = binary.split('').reverse(); // 从上往下显示
  return (
    <div className="hexagram-box">
      <h4>{label}</h4>
      <div className="hexagram-lines">
        {bits.map((b, i) => (
          <YaoLine key={i} isYang={b === '1'} isChanging={false} label={`${6 - i}`} />
        ))}
      </div>
    </div>
  );
}

export default function LiuYaoResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<LiuYaoResultType | null>(null);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    const fromState = (location.state as { result: LiuYaoResultType } | null)?.result;
    const fromStorage = sessionStorage.getItem('liuyaoResult');
    const data = fromState || (fromStorage ? JSON.parse(fromStorage) : null);
    if (!data) { navigate('/liuyao', { replace: true }); return; }
    // 兼容旧数据：如果没有 mode 字段，默认为 career
    if (!data.mode) data.mode = 'career';
    setResult(data);
    setAnalysis(generateLiuYaoAnalysis(data));
  }, [location.state, navigate]);

  const handleAiAnalysis = async () => {
    if (!result) return;
    const apiKey = getApiKey();
    if (!apiKey) {
      setAiError('请先在管理后台「API 设置」中配置 DeepSeek API Key');
      return;
    }
    setAiLoading(true);
    setAiError('');
    setAiAnalysis('');
    const res = await analyzeLiuYaoPersonality(result, apiKey);
    setAiLoading(false);
    if (res.ok) {
      setAiAnalysis(res.analysis);
    } else {
      setAiError(res.error);
    }
  };

  if (!result) return null;

  const { originalHexagram, changedHexagram, originalBinary, changedBinary, movingYaoIndices, mbtiType, mode, userQuestion } = result;
  const isDivination = mode === 'divination';

  return (
    <div className="liuyao-container page-transition">
      {/* 标题 */}
      <div className="liuyao-result-header">
        <h1>{isDivination ? '🔮 卦象解读' : '🔮 你的易经性格卦象'}</h1>
        {isDivination && userQuestion && (
          <div className="liuyao-user-question">
            <span className="question-label">你的问题：</span>
            <span className="question-text">「{userQuestion}」</span>
          </div>
        )}
      </div>

      {/* 双卦对比 */}
      <div className="hexagram-compare">
        <HexagramDisplay binary={originalBinary} label={`本卦 · ${originalHexagram.name}`} />
        {changedBinary && changedHexagram && (
          <>
            <div className="hexagram-arrow">→</div>
            <HexagramDisplay binary={changedBinary} label={`变卦 · ${changedHexagram.name}`} />
          </>
        )}
      </div>

      {/* 卦象信息 */}
      <div className="liuyao-section">
        <h2>📜 卦象解读</h2>
        <div className="hexagram-info-card">
          <div className="hexagram-name">{originalHexagram.name}（{originalHexagram.pinyin}）</div>
          <div className="hexagram-meaning">{originalHexagram.meaning}</div>
          <p className="hexagram-advice">{originalHexagram.advice}</p>
        </div>
        {changedHexagram && (
          <div className="hexagram-info-card changed">
            <div className="hexagram-name">{changedHexagram.name}（{changedHexagram.pinyin}）</div>
            <div className="hexagram-meaning">{changedHexagram.meaning}</div>
            <p className="hexagram-advice">{changedHexagram.advice}</p>
            <div className="moving-yao-info">
              动爻：第 <strong>{movingYaoIndices.join('、')}</strong> 爻
            </div>
          </div>
        )}
      </div>

      {/* 各爻详情 */}
      <div className="liuyao-section">
        <h2>📊 六爻详情</h2>
        <div className="yao-detail-list">
          {[...result.yaos].reverse().map(y => {
            const labels: Record<string, string> = {
              old_yang: '老阳 ○（阳变阴）', young_yang: '少阳 —',
              young_yin: '少阴 - -', old_yin: '老阴 X（阴变阳）',
            };
            return (
              <div key={y.index} className={`yao-detail-item ${y.isChanging ? 'changing' : ''}`}>
                <div className="yao-detail-header">
                  <span className="yao-detail-pos">第 {y.index} 爻</span>
                  <span className="yao-detail-type">{labels[y.type]}</span>
                  {y.isChanging && <span className="yao-detail-badge">动爻</span>}
                </div>
                <div className="yao-detail-line">
                  <YaoLine isYang={y.isYang} isChanging={y.isChanging} />
                </div>
                <div className="yao-detail-desc">
                  {y.dimension === 'EI' && (isDivination ? '阴阳：' : '精力来源：')}
                  {y.dimension === 'SN' && (isDivination ? '阴阳：' : '感知方式：')}
                  {y.dimension === 'TF' && (isDivination ? '阴阳：' : '决策倾向：')}
                  {y.dimension === 'JP' && (isDivination ? '阴阳：' : '生活态度：')}
                  {y.isYang ? '阳（主动、外显）' : '阴（内敛、沉静）'}
                  {y.isChanging ? ' → 即将转变' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MBTI 推演 - 仅在非问卦模式显示详细 */}
      {!isDivination && (
        <div className="liuyao-section">
          <h2>🧩 卦象推演 MBTI</h2>
          <div className="mbti-result-card">
            <div className="mbti-type-badge">{mbtiType}</div>
            <div className="mbti-analysis">
              {analysis.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {isDivination && (
        <div className="liuyao-section">
          <div className="mbti-mini-card">
            <span className="mbti-mini-badge">{mbtiType}</span>
            <span className="mbti-mini-label">卦象推演性格参考</span>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="liuyao-actions">
        <button className="primary-button" onClick={() => navigate('/liuyao')}>
          {isDivination ? '再问一卦' : '重新测试'}
        </button>
        <button className="secondary-button" onClick={() => {
          const html = generateLiuYaoReport(result);
          downloadReport(html, `易经报告_${originalHexagram.name}_${new Date().toLocaleDateString('zh-CN')}.html`);
        }}>📥 下载报告</button>
        <button
          className="primary-button ai-btn"
          onClick={handleAiAnalysis}
          disabled={aiLoading}
        >
          {aiLoading
            ? '🤖 AI 分析中...'
            : isDivination
              ? '🤖 AI 解卦'
              : '🤖 AI 深度洞察'}
        </button>
        <button className="secondary-button" onClick={() => navigate('/')}>返回首页</button>
      </div>

      {/* AI 深度洞察 */}
      {(aiLoading || aiAnalysis || aiError) && (
        <div className="ai-analysis-section" style={{ marginTop: '2rem' }}>
          <h2>{isDivination ? '🤖 AI 卦象解读' : '🤖 AI 深度洞察'}</h2>
          {aiLoading && (
            <div className="ai-loading">
              <div className="ai-loading-dots">
                <span /><span /><span />
              </div>
              <p>{isDivination ? 'AI 正在结合卦象与你的问题进行分析...' : 'AI 正在结合卦象与 MBTI 分析你的性格特质...'}</p>
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
}
