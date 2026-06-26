import { useState, useEffect } from 'react';
import { batchService } from '@/services/adminService';
import type { Batch } from '@/types/mbti';

export default function BatchManagement() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Batch | null>(null);
  const [form, setForm] = useState({ name: '', description: '', startDate: '', endDate: '', active: true });

  useEffect(() => { batchService.getAll().then(setBatches); }, []);

  const refresh = async () => { const data = await batchService.getAll(); setBatches(data); };

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', startDate: '', endDate: '', active: true }); setShowModal(true); };
  const openEdit = (b: Batch) => { setEditing(b); setForm({ name: b.name, description: b.description, startDate: b.startDate, endDate: b.endDate, active: b.active }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.startDate || !form.endDate) return;
    try {
      if (editing) {
        await batchService.save({ ...editing, ...form });
      } else {
        await batchService.save({ ...form, createdAt: new Date().toISOString() } as Batch);
      }
      setShowModal(false);
      refresh();
    } catch (e) { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定删除该批次？关联的测试安排和参测人员将不受影响。')) {
      try { await batchService.delete(id); refresh(); } catch (e) { /* ignore */ }
    }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>批次管理</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ 添加批次</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>名称</th><th>描述</th><th>开始日期</th><th>结束日期</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            {batches.length === 0 && <tr><td colSpan={7}><div className="empty-state"><p>暂无批次数据</p></div></td></tr>}
            {batches.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td><td>{b.name}</td><td>{b.description}</td>
                <td>{b.startDate}</td><td>{b.endDate}</td>
                <td><span className={`status-badge ${b.active ? 'active' : 'inactive'}`}>{b.active ? '启用' : '禁用'}</span></td>
                <td>
                  <button className="btn btn-edit btn-sm" onClick={() => openEdit(b)}>编辑</button>
                  <button className="btn btn-delete btn-sm" onClick={() => handleDelete(b.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editing ? '编辑批次' : '添加批次'}</h2>
            <div className="form-group">
              <label>批次名称</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="如：2026年第一批次" />
            </div>
            <div className="form-group">
              <label>描述</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>开始日期</label>
                <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label>结束日期</label>
                <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
              </div>
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
