import { useState, useEffect } from 'react';
import { scheduleService, batchService, assessmentTypeService } from '@/services/adminService';
import type { TestSchedule, Batch, AssessmentType } from '@/types/mbti';

export default function TestScheduleManagement() {
  const [schedules, setSchedules] = useState<TestSchedule[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [types, setTypes] = useState<AssessmentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TestSchedule | null>(null);
  const [form, setForm] = useState({ batchId: 1, assessmentTypeId: 1, startTime: '', endTime: '', location: '', active: true });

  useEffect(() => {
    scheduleService.getAll().then(setSchedules);
    batchService.getAll().then(setBatches);
    assessmentTypeService.getAll().then(setTypes);
  }, []);

  const refresh = async () => { const data = await scheduleService.getAll(); setSchedules(data); };

  const openAdd = () => {
    setEditing(null);
    setForm({ batchId: batches[0]?.id || 1, assessmentTypeId: types[0]?.id || 1, startTime: '', endTime: '', location: '', active: true });
    setShowModal(true);
  };

  const openEdit = (s: TestSchedule) => {
    setEditing(s);
    setForm({ batchId: s.batchId, assessmentTypeId: s.assessmentTypeId, startTime: s.startTime, endTime: s.endTime, location: s.location, active: s.active });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.startTime || !form.endTime) return;
    try {
      const batch = batches.find(b => b.id === form.batchId);
      const type = types.find(t => t.id === form.assessmentTypeId);
      if (editing) {
        await scheduleService.save({ ...editing, ...form, batchName: batch?.name || '', assessmentTypeName: type?.name || '' });
      } else {
        await scheduleService.save({
          ...form,
          batchName: batch?.name || '',
          assessmentTypeName: type?.name || '',
          createdAt: new Date().toISOString(),
        } as TestSchedule);
      }
      setShowModal(false);
      refresh();
    } catch (e) { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定删除？')) { try { await scheduleService.delete(id); refresh(); } catch (e) { /* ignore */ } }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>测试安排管理</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ 添加安排</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>所属批次</th><th>考核类型</th><th>开始时间</th><th>结束时间</th><th>地点</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            {schedules.length === 0 && <tr><td colSpan={8}><div className="empty-state"><p>暂无安排</p></div></td></tr>}
            {schedules.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td><td>{s.batchName}</td><td>{s.assessmentTypeName}</td>
                <td>{new Date(s.startTime).toLocaleString()}</td><td>{new Date(s.endTime).toLocaleString()}</td>
                <td>{s.location || '-'}</td>
                <td><span className={`status-badge ${s.active ? 'active' : 'inactive'}`}>{s.active ? '启用' : '禁用'}</span></td>
                <td>
                  <button className="btn btn-edit btn-sm" onClick={() => openEdit(s)}>编辑</button>
                  <button className="btn btn-delete btn-sm" onClick={() => handleDelete(s.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editing ? '编辑安排' : '添加安排'}</h2>
            <div className="form-group">
              <label>所属批次</label>
              <select value={form.batchId} onChange={e => setForm({...form, batchId: Number(e.target.value)})}>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>考核类型</label>
              <select value={form.assessmentTypeId} onChange={e => setForm({...form, assessmentTypeId: Number(e.target.value)})}>
                {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>开始时间</label>
                <input type="datetime-local" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
              </div>
              <div className="form-group">
                <label>结束时间</label>
                <input type="datetime-local" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>地点</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="如：线上 / 会议室A" />
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
