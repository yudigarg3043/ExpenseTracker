'use client';
import { useState, useEffect } from 'react';

export default function TransactionModal({ isOpen, onClose, onRefresh }: any) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories([...data.defaults, ...data.custom]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount: Number(amount), category, date, description }),
    });
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    onRefresh();
    onClose();
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2 className="heading" style={{ margin: 0 }}>Add {type === 'income' ? 'Income' : 'Expense'}</h2>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
        <form onSubmit={handleSubmit}>
          <select className="input-field" value={type} onChange={(e) => { setType(e.target.value); setCategory(''); }}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input type="number" className="input-field" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0" step="0.01" />
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="" disabled>Select {type === 'income' ? 'Source' : 'Category'}</option>
            {filteredCategories.map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>
          <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} required />
          <input type="text" className="input-field" placeholder="Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button type="submit" className="btn-primary">Save</button>
        </form>
      </div>
    </div>
  );
}
