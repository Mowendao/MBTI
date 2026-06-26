import { useState, useEffect } from 'react';
import api from '@/services/api';

interface AiType {
  id: number;
  code: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  sysPrompt: string;
  openingLine: string;
  resultParseRule: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export default function AiTypeManagement() {
  const [types, setTypes] = useState<AiType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AiType | null>(null);
  const [form, setForm] = useState({
    code: '', name: '', icon: '🧠', description: '', color: '#667eea',
    sysPrompt: '', openingLine: '', resultParseRule: 'plain_text', sortOrder: 0, active: true,
  });
  const [msg, setMsg] = useState('');

  const load = async () => {
    const res = await api.get('/admin/ai-assessment-types');
    setTypes(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ code: '', name: '', icon: '🧠', description: '', color: '#667eea', sysPrompt: '', openingLine: '', resultParseRule: 'plain_text', sortOrder: types.length + 1, active: true });
    setShowModal(true);
  };

  const openEdit = (t: AiType) => {
    setEditing(t);
    setForm({ code: t.code, name: t.name, icon: t.icon, description: t.description, color: t.color, sysPrompt: t.sysPrompt, openingLine: t.openingLine, resultParseRule: t.resultParseRule, sortOrder: t.sortOrder, active: t.active });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code) { setMsg('请填写名称和编码'); return; }
    try {
      if (editing) {
        await api.put(`/admin/ai-assessment-types/${editing.id}`, form);
      } else {
        await api.post('/admin/ai-assessment-types', form);
      }
      setShowModal(false);
      setMsg('');
      load();
    } catch (e: any) {
      setMsg(e.response?.data?.message || '操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return;
    await api.delete(`/admin/ai-assessment-types/${id}`);
    load();
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>🧠 AI 评估类型管理</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ 添加类型</button>
      </div>
      {msg && <p style={{ color: '#d32f2f', marginBottom: '1rem' }}>{msg}</p>}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>图标</th><th>编码</th><th>名称</th><th>颜色</th><th>排序</th><th>状态</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            {types.length === 0 && (
              <tr><td colSpan={8}><div className="empty-state"><p>暂无数据</p></div></td></tr>
            )}
            {types.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td style={{ fontSize: '1.5rem' }}>{t.icon}</td>
                <td><code>{t.code}</code></td>
                <td>{t.name}</td>
                <td><span style={{ display: 'inline-block', width: 20, height: 20, borderRadius: 4, background: t.color, verticalAlign: 'middle' }} /> {t.color}</td>
                <td>{t.sortOrder}</td>
                <td><span className={`status-badge ${t.active ? 'active' : 'inactive'}`}>{t.active ? '启用' : '禁用'}</span></td>
                <td>
                  <button className="btn btn-edit btn-sm" onClick={() => openEdit(t)}>编辑</button>
                  <button className="btn btn-delete btn-sm" onClick={() => handleDelete(t.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <h2>{editing ? '编辑评估类型' : '添加评估类型'}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label>编码 *</label>
                <input value={form.code} onChange={e => setForm({...form, code: e.target.value})} placeholder="mbti" />
              </div>
              <div className="form-group">
                <label>名称 *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="MBTI 性格评估" />
              </div>
              <div className="form-group">
                <label>图标 (emoji)</label>
                <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="🧠" />
              </div>
              <div className="form-group">
                <label>主题色</label>
                <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
              </div>
              <div className="form-group">
                <label>解析规则</label>
                <select value={form.resultParseRule} onChange={e => setForm({...form, resultParseRule: e.target.value})}>
                  <option value="plain_text">纯文本</option>
                  <option value="mbti_4letter">MBTI 四字母</option>
                </select>
              </div>
              <div className="form-group">
                <label>排序</label>
                <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: Number(e.target.value)})} />
              </div>
            </div>

            <div className="form-group">
              <label>简介</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} />
            </div>
            <div className="form-group">
              <label>AI System Prompt</label>
              <textarea value={form.sysPrompt} onChange={e => setForm({...form, sysPrompt: e.target.value})} rows={6} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
            </div>
            <div className="form-group">
              <label>开场白</label>
              <textarea value={form.openingLine} onChange={e => setForm({...form, openingLine: e.target.value})} rows={3} />
            </div>
            <div className="form-group">
              <label><input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} /> 启用</label>
            </div>

            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
