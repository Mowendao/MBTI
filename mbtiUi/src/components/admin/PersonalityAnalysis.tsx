import { useState, useEffect } from 'react';
import { adminTestResultService } from '@/services/adminService';
import { getCareerRecommendations } from '@/utils/careerRecommendation';
import { getMBTIDescription } from '@/utils/mbti';
import { careers } from '@/data/careers';
import type { MBTIType, AdminTestResult } from '@/types/mbti';

export default function PersonalityAnalysis() {
  const [results, setResults] = useState<AdminTestResult[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [careerStats, setCareerStats] = useState<{ type: string; count: number }[]>([]);

  useEffect(() => {
    adminTestResultService.getAll().then(all => {
      setResults(all);

      // 统计各类型分布
      const dist: Record<string, number> = {};
      all.forEach(r => { dist[r.personalityType] = (dist[r.personalityType] || 0) + 1; });
      setCareerStats(Object.entries(dist).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count));
    });
  }, []);

  const filtered = filter === 'all' ? results : results.filter(r => r.personalityType === filter);

  const allTypes = [...new Set(results.map(r => r.personalityType))];

  const mbtiTypes: MBTIType[] = [
    'ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP',
    'ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ',
  ];

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>性格分析与职业匹配</h1>
      </div>

      {/* 概览统计 */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderLeftColor: '#667eea' }}>
          <h3>总测试人数</h3>
          <p className="stat-number">{results.length}</p>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#764ba2' }}>
          <h3>识别类型数</h3>
          <p className="stat-number">{allTypes.length}</p>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f093fb' }}>
          <h3>职业方向数</h3>
          <p className="stat-number">{careers.length}</p>
        </div>
      </div>

      {/* 类型分布 */}
      <div className="table-container" style={{ marginBottom: '1.5rem', padding: '1.2rem' }}>
        <h3 style={{ margin: '0 0 1rem', color: '#333' }}>性格类型分布</h3>
        {careerStats.length === 0 ? (
          <p style={{ color: '#999' }}>暂无测试数据</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {careerStats.map(s => {
              const pct = Math.round((s.count / results.length) * 100);
              return (
                <div key={s.type} style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#fff',
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  minWidth: '100px',
                  textAlign: 'center'
                }}>
                  <strong>{s.type}</strong>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{s.count} 人 ({pct}%)</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MBTI 类型与职业对照表 */}
      <div className="table-container" style={{ marginBottom: '1.5rem', padding: '1.2rem' }}>
        <h3 style={{ margin: '0 0 1rem', color: '#333' }}>MBTI 类型 · 职业推荐对照表</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>MBTI 类型</th>
                <th>名称</th>
                <th>描述</th>
                <th>推荐职业</th>
              </tr>
            </thead>
            <tbody>
              {mbtiTypes.map(type => {
                const desc = getMBTIDescription(type);
                const recs = getCareerRecommendations(type);
                return (
                  <tr key={type}>
                    <td><strong style={{ color: '#667eea' }}>{type}</strong></td>
                    <td>{desc.split('：')[0]}</td>
                    <td style={{ fontSize: '0.8rem', color: '#666', maxWidth: '250px' }}>{desc}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {recs.slice(0, 3).map(c => (
                          <span key={c.id} className="status-badge active">{c.name}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 详细结果列表 */}
      <div className="table-container" style={{ padding: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#333' }}>测试结果明细</h3>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px' }}>
            <option value="all">全部类型</option>
            {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>姓名</th><th>类型</th><th>测试时间</th><th>性格分析</th><th>职业推荐</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={5}><div className="empty-state"><p>暂无数据</p></div></td></tr>}
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>{r.testTakerName}</td>
                  <td><span className="status-badge active" style={{ background: '#667eea', color: '#fff' }}>{r.personalityType}</span></td>
                  <td>{new Date(r.completedAt).toLocaleDateString()}</td>
                  <td style={{ maxWidth: '200px', fontSize: '0.8rem', color: '#666' }}>{r.analysis}</td>
                  <td style={{ maxWidth: '200px', fontSize: '0.8rem' }}>
                    {r.careerRecommendation ? (
                      <span className="status-badge completed">{r.careerRecommendation}</span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
