import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMBTIDescription } from '@/utils/mbti';
import type { MBTIType } from '@/types/mbti';
import './History.css';

const dimensionLabels: Record<string, string> = {
  E: '外向', I: '内向', S: '感觉', N: '直觉',
  T: '思考', F: '情感', J: '判断', P: '感知',
};

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="history-container page-transition">
        <h1>测试历史</h1>
        <div className="history-empty">
          <p>请先登录 / 注册后再查看历史记录。</p>
          <button className="primary-button" onClick={() => navigate('/')}>返回首页</button>
        </div>
      </div>
    );
  }

  const results = [...(user.testResults || [])].reverse();

  return (
    <div className="history-container page-transition">
      <h1>测试历史记录</h1>
      <p className="history-subtitle">{user.name}，共 {results.length} 次测试</p>

      {results.length === 0 ? (
        <div className="history-empty">
          <p>暂无测试记录，快去完成你的第一次 MBTI 测试吧！</p>
          <button className="primary-button" onClick={() => navigate('/test')}>开始测试</button>
        </div>
      ) : (
        <div className="history-list">
          {results.map((r, idx) => {
            const type = r.type as MBTIType;
            const desc = getMBTIDescription(type);
            const date = new Date(r.date);
            return (
              <div key={r.date + idx} className="history-card"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="history-card-header">
                  <span className="history-type">{r.type}</span>
                  <span className="history-date">
                    {date.toLocaleDateString('zh-CN')} {date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="history-desc">{desc}</p>
                <div className="history-scores">
                  {Object.entries(r.scores).map(([key, val]) => (
                    <span key={key} className="history-score-tag">
                      {dimensionLabels[key] || key}: {val}
                    </span>
                  ))}
                </div>
                <div className="history-percentages">
                  {(['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'] as const).map((dim) => (
                    <div key={dim} className="history-bar-item">
                      <span className="history-bar-label">{dim}</span>
                      <div className="history-bar-track">
                        <div className="history-bar-fill" style={{ width: `${r.percentage[dim]}%` }} />
                      </div>
                      <span className="history-bar-value">{r.percentage[dim]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
