import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{
        fontSize: '8rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
        marginBottom: '1rem',
      }}>
        404
      </div>
      <h1 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
        页面未找到
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '400px' }}>
        你访问的页面不存在或已被移除，请检查链接是否正确。
      </p>
      <Link
        to="/"
        style={{
          padding: '0.8rem 2rem',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'all 0.2s',
        }}
      >
        返回首页
      </Link>
    </div>
  );
}
