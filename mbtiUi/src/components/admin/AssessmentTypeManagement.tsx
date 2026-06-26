import { useState, useEffect } from 'react';
import { assessmentTypeService } from '@/services/adminService';
import type { AssessmentType } from '@/types/mbti';

export default function AssessmentTypeManagement() {
  const [types, setTypes] = useState<AssessmentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AssessmentType | null>(null);
  const [form, setForm] = useState({ name: '', description: '', active: true });

  useEffect(() => { assessmentTypeService.getAll().then(setTypes); }, []);

  const refresh = async () => { const data = await assessmentTypeService.getAll(); setTypes(data); };

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', active: true }); setShowModal(true); };
  const openEdit = (t: AssessmentType) => { setEditing(t); setForm({ name: t.name, description: t.description, active: t.active }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name) return;
    try {
      if (editing) {
        await assessmentTypeService.save({ ...editing, ...form });
      } else {
        await assessmentTypeService.save({ ...form, createdAt: new Date().toISOString() } as AssessmentType);
      }
      setShowModal(false);
      refresh();
    } catch (e) { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定删除？')) {
      try { await assessmentTypeService.delete(id); refresh(); } catch (e) { /* ignore */ }
    }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>考核类型管理</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ 添加类型</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>名称</th><th>描述</th><th>状态</th><th>创建时间</th><th>操作</th></tr>
          </thead>
          <tbody>
            {types.length === 0 && <tr><td colSpan={6}><div className="empty-state"><p>暂无数据</p></div></td></tr>}
            {types.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td><td>{t.name}</td><td>{t.description}</td>
                <td><span className={`status-badge ${t.active ? 'active' : 'inactive'}`}>{t.active ? '启用' : '禁用'}</span></td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
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
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editing ? '编辑考核类型' : '添加考核类型'}</h2>
            <div className="form-group">
              <label>名称</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>描述</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
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
