'use client';
import { useState } from 'react';

export default function CategoryModal({ isOpen, onClose }: any) {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type }),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2 className="heading" style={{ margin: 0 }}>Add Custom Category</h2>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" className="input-field" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="btn-primary">Save Category</button>
        </form>
      </div>
    </div>
  );
}
