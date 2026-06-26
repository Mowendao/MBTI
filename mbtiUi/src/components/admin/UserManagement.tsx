import { useState, useEffect } from 'react';
import { adminUserService } from '@/services/adminService';
import type { User } from '@/types/mbti';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' as 'ADMIN' | 'USER', active: true, phone: '', department: '', position: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { adminUserService.getAll().then(setUsers); }, []);

  const refresh = async () => { const data = await adminUserService.getAll(); setUsers(data); };

  const openAdd = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', password: '', role: 'USER', active: true, phone: '', department: '', position: '' });
    setShowModal(true);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role || 'USER', active: u.active ?? true, phone: u.phone || '', department: u.department || '', position: u.position || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { setMsg('请填写姓名和邮箱'); return; }
    try {
      if (editingUser) {
        const updated: User = { ...editingUser, name: form.name, email: form.email, role: form.role, active: form.active, phone: form.phone, department: form.department, position: form.position };
        if (form.password) updated.password = form.password;
        await adminUserService.save(updated);
      } else {
        const newUser: Omit<User, 'id'> = {
          name: form.name,
          email: form.email,
          password: form.password || '123456',
          role: form.role,
          active: form.active,
          phone: form.phone,
          department: form.department,
          position: form.position,
          testResults: [],
          createdAt: new Date().toISOString(),
        };
        await adminUserService.save(newUser as User);
      }
      setShowModal(false);
      setMsg('');
      refresh();
    } catch (e) { setMsg('保存失败'); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定删除该用户？')) {
      try { await adminUserService.delete(id); refresh(); } catch (e) { setMsg('删除失败'); }
    }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>用户管理</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ 添加用户</button>
      </div>
      {msg && <p style={{ color: '#d32f2f', marginBottom: '1rem' }}>{msg}</p>}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>部门</th>
              <th>状态</th>
              <th>测试次数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={8}><div className="empty-state"><p>暂无用户数据</p></div></td></tr>
            )}
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`status-badge ${u.role === 'ADMIN' ? 'active' : 'completed'}`}>{u.role === 'ADMIN' ? '管理员' : '用户'}</span></td>
                <td>{u.department || '-'}</td>
                <td><span className={`status-badge ${u.active !== false ? 'active' : 'inactive'}`}>{u.active !== false ? '活跃' : '禁用'}</span></td>
                <td>{u.testResults?.length || 0}</td>
                <td>
                  <button className="btn btn-edit btn-sm" onClick={() => openEdit(u)}>编辑</button>
                  <button className="btn btn-delete btn-sm" onClick={() => handleDelete(u.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingUser ? '编辑用户' : '添加用户'}</h2>
            <div className="form-group">
              <label>姓名 *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>邮箱 *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>密码 {editingUser && '(留空不修改)'}</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className="form-group">
              <label>角色</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value as 'ADMIN' | 'USER'})}>
                <option value="USER">用户</option>
                <option value="ADMIN">管理员</option>
              </select>
            </div>
            <div className="form-group">
              <label>部门</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="手机号" />
            </div>
            <div className="form-group">
              <label>部门</label>
              <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="部门名称" />
            </div>
            <div className="form-group">
              <label>职位</label>
              <input value={form.position} onChange={e => setForm({...form, position: e.target.value})} placeholder="职位名称" />
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
