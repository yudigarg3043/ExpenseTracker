'use client';
import { useState, useEffect } from 'react';

export default function BudgetModal({ isOpen, onClose, onRefresh }: any) {
  const [budget, setBudget] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/budget').then(res => res.json()).then(data => setBudget(data.monthlyBudget.toString()));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/budget', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monthlyBudget: Number(budget) }),
    });
    onRefresh();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2 className="heading" style={{ margin: 0 }}>Set Monthly Budget</h2>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="number" className="input-field" placeholder="Monthly Budget Amount" value={budget} onChange={(e) => setBudget(e.target.value)} required min="0" step="0.01" />
          <button type="submit" className="btn-primary">Save Budget</button>
        </form>
      </div>
    </div>
  );
}
