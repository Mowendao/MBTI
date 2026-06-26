import { useState, useEffect } from 'react';
import { adminUserService, assessmentTypeService, batchService, adminTestResultService } from '@/services/adminService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTypes: 0,
    totalBatches: 0,
    totalTestResults: 0,
    completedTests: 0,
  });
  const [typeDistribution, setTypeDistribution] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const [users, types, batches, results, stats] = await Promise.all([
        adminUserService.getAll(),
        assessmentTypeService.getAll(),
        batchService.getAll(),
        adminTestResultService.getAll(),
        adminTestResultService.getStats(),
      ]);
      setStats({
        totalUsers: users.length,
        totalTypes: types.length,
        totalBatches: batches.length,
        totalTestResults: results.length,
        completedTests: stats.completed,
      });
      setTypeDistribution(stats.typeDistribution);
    })();
  }, []);

  const cards = [
    { title: '注册用户', value: stats.totalUsers, color: '#667eea' },
    { title: '考核类型', value: stats.totalTypes, color: '#764ba2' },
    { title: '测试批次', value: stats.totalBatches, color: '#f093fb' },
    { title: '测试结果', value: stats.totalTestResults, color: '#4facfe' },
    { title: '已完成测试', value: stats.completedTests, color: '#00f2fe' },
  ];

  const sortedTypes = Object.entries(typeDistribution).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedTypes.length > 0 ? sortedTypes[0][1] : 1;

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>仪表盘</h1>
      </div>
      <div className="stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: card.color }}>
            <h3>{card.title}</h3>
            <p className="stat-number">{card.value}</p>
          </div>
        ))}
      </div>

      {sortedTypes.length > 0 && (
        <div className="table-container" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#333' }}>MBTI 类型分布</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {sortedTypes.map(([type, count]) => (
              <div key={type} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: '#f5f5f5', borderRadius: '8px', padding: '0.5rem 0.75rem',
              }}>
                <span style={{ fontWeight: 700, color: '#667eea', fontSize: '0.95rem' }}>{type}</span>
                <div style={{
                  height: '8px', borderRadius: '4px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  width: `${Math.max(20, (count / maxCount) * 120)}px`,
                }} />
                <span style={{ fontSize: '0.8rem', color: '#999' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="table-container" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#333' }}>系统导航</h2>
        <p style={{ color: '#666', lineHeight: 1.8 }}>
          欢迎使用 MBTI 性格测试与就业推荐管理系统。本系统提供完整的测试流程管理、性格分析和职业推荐功能。
          使用左侧导航栏进入各管理模块。
        </p>
      </div>
    </div>
  );
}
