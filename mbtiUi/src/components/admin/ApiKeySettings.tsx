import { useState, useEffect } from 'react';
import { saveApiKey, getApiKey, clearApiKey, maskApiKey, testConnection } from '@/services/aiService';

export default function ApiKeySettings() {
  const [key, setKey] = useState('');
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'ok' | 'err' | ''>('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setKey(getApiKey());
  }, []);

  const handleSave = () => {
    if (!input.trim()) { setMsg('请输入 API Key'); setMsgType('err'); return; }
    saveApiKey(input.trim());
    setKey(input.trim());
    setInput('');
    setShowInput(false);
    setMsg('API Key 已保存（存储在 sessionStorage，关闭标签页后自动清除）');
    setMsgType('ok');
  };

  const handleClear = () => {
    clearApiKey();
    setKey('');
    setMsg('API Key 已清除');
    setMsgType('ok');
  };

  const handleTest = async () => {
    if (!key) { setMsg('请先保存 API Key'); setMsgType('err'); return; }
    setTesting(true);
    setMsg('正在测试连接...');
    setMsgType('');
    const result = await testConnection(key);
    setTesting(false);
    if (result.ok) {
      setMsg('连接成功！API Key 有效');
      setMsgType('ok');
    } else {
      setMsg(`连接失败：${result.error}`);
      setMsgType('err');
    }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>API 设置</h1>
      </div>

      <div className="table-container" style={{ padding: '2rem', maxWidth: '700px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.75rem', color: '#333' }}>DeepSeek API Key</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            用于 AI 智能题库导入功能。API Key 存储在浏览器 sessionStorage 中，关闭标签页后自动清除，不会上传到任何服务器。
          </p>
        </div>

        <div className="form-group">
          <label style={{ fontWeight: 600 }}>当前状态</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            {key ? (
              <>
                <span style={{
                  padding: '0.4rem 0.75rem',
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                }}>
                  {maskApiKey(key)}
                </span>
                <span style={{ color: '#2e7d32', fontSize: '0.85rem' }}>✓ 已配置</span>
              </>
            ) : (
              <span style={{
                padding: '0.4rem 0.75rem',
                background: '#fff3e0',
                color: '#e65100',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}>
                未配置
              </span>
            )}
          </div>
        </div>

        {showInput && (
          <div className="form-group">
            <label style={{ fontWeight: 600 }}>输入 API Key</label>
            <input
              type="password"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="sk-..."
              style={{ fontFamily: 'monospace', marginTop: '0.5rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" onClick={handleSave}>保存</button>
              <button className="btn btn-cancel" onClick={() => { setShowInput(false); setInput(''); }}>取消</button>
            </div>
          </div>
        )}

        {!showInput && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setShowInput(true)}>
              {key ? '更新 Key' : '设置 Key'}
            </button>
            {key && (
              <>
                <button className="btn btn-cancel" onClick={handleTest} disabled={testing}>
                  {testing ? '测试中...' : '测试连接'}
                </button>
                <button className="btn btn-delete" onClick={handleClear}>清除</button>
              </>
            )}
          </div>
        )}

        {msg && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            fontSize: '0.9rem',
            background: msgType === 'ok' ? '#e8f5e9' : msgType === 'err' ? '#ffebee' : '#f5f5f5',
            color: msgType === 'ok' ? '#2e7d32' : msgType === 'err' ? '#c62828' : '#333',
          }}>
            {msg}
          </div>
        )}

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#555', fontSize: '0.95rem' }}>安全说明</h4>
          <ul style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
            <li>API Key 仅存储在浏览器 sessionStorage 中</li>
            <li>关闭标签页或浏览器后 Key 会自动清除</li>
            <li>Key 不会发送到除 DeepSeek 官方 API 以外的任何地方</li>
            <li>页面显示时会对 Key 进行脱敏处理（sk-****abcd）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
