import { useState, useEffect } from 'react';
import { dimensionService } from '@/services/adminService';
import type { PersonalityDimension } from '@/types/mbti';

export default function PersonalityDimensionManagement() {
  const [dims, setDims] = useState<PersonalityDimension[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PersonalityDimension | null>(null);
  const [form, setForm] = useState({ code: '', name: '', description: '', category: 'EI' as 'EI' | 'SN' | 'TF' | 'JP' });

  useEffect(() => { dimensionService.getAll().then(setDims); }, []);

  const refresh = async () => { const data = await dimensionService.getAll(); setDims(data); };

  const openAdd = () => { setEditing(null); setForm({ code: '', name: '', description: '', category: 'EI' }); setShowModal(true); };
  const openEdit = (d: PersonalityDimension) => { setEditing(d); setForm({ code: d.code, name: d.name, description: d.description, category: d.category }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.code || !form.name) return;
    try {
      if (editing) {
        await dimensionService.save({ ...editing, ...form });
      } else {
        await dimensionService.save({ ...form } as PersonalityDimension);
      }
      setShowModal(false);
      refresh();
    } catch (e) { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定删除？')) {
      try { await dimensionService.delete(id); refresh(); } catch (e) { /* ignore */ }
    }
  };

  const catLabels: Record<string, string> = { EI: '精力态度', SN: '认知方式', TF: '决策方式', JP: '生活方式' };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>性格维度管理</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ 添加维度</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>代码</th><th>名称</th><th>描述</th><th>所属维度</th><th>操作</th></tr>
          </thead>
          <tbody>
            {dims.length === 0 && <tr><td colSpan={6}><div className="empty-state"><p>暂无数据</p></div></td></tr>}
            {dims.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td><td><strong>{d.code}</strong></td><td>{d.name}</td><td>{d.description}</td>
                <td><span className="status-badge active">{catLabels[d.category] || d.category}</span></td>
                <td>
                  <button className="btn btn-edit btn-sm" onClick={() => openEdit(d)}>编辑</button>
                  <button className="btn btn-delete btn-sm" onClick={() => handleDelete(d.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editing ? '编辑维度' : '添加维度'}</h2>
            <div className="form-group">
              <label>代码（E/I/S/N/T/F/J/P）</label>
              <input value={form.code} onChange={e => setForm({...form, code: e.target.value})} maxLength={2} />
            </div>
            <div className="form-group">
              <label>名称</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>描述</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="form-group">
              <label>所属维度类别</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value as 'EI' | 'SN' | 'TF' | 'JP'})}>
                <option value="EI">精力态度 (EI)</option>
                <option value="SN">认知方式 (SN)</option>
                <option value="TF">决策方式 (TF)</option>
                <option value="JP">生活方式 (JP)</option>
              </select>
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
