import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!form.email) {
      setError('请填写邮箱');
      return;
    }

    if (mode === 'login') {
      const result = await login(form.email, form.password);
      if (result.ok) {
        onClose();
      } else {
        setError(result.error || '登录失败');
      }
    } else {
      if (!form.name) {
        setError('请填写姓名');
        return;
      }
      const result = await register(form.email, form.name, form.password || undefined);
      if (result.ok) {
        onClose();
      } else {
        setError(result.error || '注册失败');
      }
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>✕</button>

        <div className="auth-modal-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            登录
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            注册
          </button>
        </div>

        <div className="auth-modal-body">
          {mode === 'register' && (
            <div className="auth-form-group">
              <label>姓名</label>
              <input
                type="text"
                placeholder="请输入姓名"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          <div className="auth-form-group">
            <label>邮箱</label>
            <input
              type="email"
              placeholder="请输入邮箱"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="auth-form-group">
            <label>密码 {mode === 'register' && <span className="auth-optional">(可选)</span>}</label>
            <input
              type="password"
              placeholder={mode === 'register' ? '可不填，方便下次登录' : '请输入密码'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button className="auth-submit" onClick={handleSubmit}>
            {mode === 'login' ? '登录' : '注册'}
          </button>

          <p className="auth-switch">
            {mode === 'login' ? '还没有账号？' : '已有账号？'}
            <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
              {mode === 'login' ? '立即注册' : '去登录'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
