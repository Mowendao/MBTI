import { useState, useEffect } from 'react';
import { testTakerService, batchService } from '@/services/adminService';
import type { TestTaker, Batch } from '@/types/mbti';

export default function TestTakerManagement() {
  const [takers, setTakers] = useState<TestTaker[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TestTaker | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', position: '', batchId: 1 });

  useEffect(() => {
    testTakerService.getAll().then(setTakers);
    batchService.getAll().then(setBatches);
  }, []);

  const refresh = async () => { const data = await testTakerService.getAll(); setTakers(data); };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', department: '', position: '', batchId: batches[0]?.id || 1 });
    setShowModal(true);
  };

  const openEdit = (t: TestTaker) => {
    setEditing(t);
    setForm({ name: t.name, email: t.email, phone: t.phone, department: t.department, position: t.position, batchId: t.batchId });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    try {
      const batch = batches.find(b => b.id === form.batchId);
      if (editing) {
        await testTakerService.save({ ...editing, ...form, batchName: batch?.name || '' });
      } else {
        await testTakerService.save({
          ...form,
          batchName: batch?.name || '',
          createdAt: new Date().toISOString(),
        } as TestTaker);
      }
      setShowModal(false);
      refresh();
    } catch (e) { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定删除？')) { try { await testTakerService.delete(id); refresh(); } catch (e) { /* ignore */ } }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>参测人员管理</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ 添加人员</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>姓名</th><th>邮箱</th><th>电话</th><th>部门</th><th>职位</th><th>所属批次</th><th>操作</th></tr>
          </thead>
          <tbody>
            {takers.length === 0 && <tr><td colSpan={8}><div className="empty-state"><p>暂无参测人员</p></div></td></tr>}
            {takers.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td><td>{t.name}</td><td>{t.email}</td><td>{t.phone || '-'}</td>
                <td>{t.department || '-'}</td><td>{t.position || '-'}</td><td>{t.batchName}</td>
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
            <h2>{editing ? '编辑人员' : '添加人员'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>姓名 *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>邮箱 *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>电话</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>部门</label>
                <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
              </div>
              <div className="form-group">
                <label>职位</label>
                <input value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
              </div>
              <div className="form-group">
                <label>所属批次</label>
                <select value={form.batchId} onChange={e => setForm({...form, batchId: Number(e.target.value)})}>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
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
