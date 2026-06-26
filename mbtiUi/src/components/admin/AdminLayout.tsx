import { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import './AdminLayout.css';

const navItems = [
  { name: '仪表盘', path: '/admin/dashboard', icon: '📊' },
  { name: '用户管理', path: '/admin/users', icon: '👤' },
  { name: '考核类型管理', path: '/admin/assessment-types', icon: '📋' },
  { name: '性格维度管理', path: '/admin/personality-dimensions', icon: '🧩' },
  { name: '题目管理', path: '/admin/questions', icon: '📝' },
  { name: '批次管理', path: '/admin/batches', icon: '📦' },
  { name: '测试安排管理', path: '/admin/schedules', icon: '📅' },
  { name: '参测人员管理', path: '/admin/test-takers', icon: '👥' },
  { name: '性格分析', path: '/admin/analysis', icon: '🔍' },
  { name: 'API 设置', path: '/admin/api-settings', icon: '🔑' },
];

export default function AdminLayout() {
  const { user } = useAuth();

  // 非管理员无权访问
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          {!collapsed && <h1 className="admin-logo">MBTI管理</h1>}
          <button className="admin-toggle-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '☰' : '✕'}
          </button>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {!collapsed && <span className="admin-nav-text">{item.name}</span>}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item">
            <span className="admin-nav-icon">🏠</span>
            {!collapsed && <span className="admin-nav-text">返回前台</span>}
          </Link>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
