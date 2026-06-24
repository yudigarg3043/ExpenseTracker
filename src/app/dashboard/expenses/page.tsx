'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [filterCategory, setFilterCategory] = useState('All');
  const [categories, setCategories] = useState<any[]>([]);

  const fetchData = async () => {
    const tRes = await fetch(`/api/transactions?month=${filterMonth}&category=${filterCategory}`);
    const tData = await tRes.json();
    setTransactions(tData.filter((t: any) => t.type === 'expense'));

    const cRes = await fetch('/api/categories');
    const cData = await cRes.json();
    setCategories([...cData.defaults, ...cData.custom].filter(c => c.type === 'expense'));
  };

  useEffect(() => {
    fetchData();
  }, [filterMonth, filterCategory]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard" className="btn-secondary" style={{ padding: '0.5rem' }}>← Back</Link>
          <h2 className="heading" style={{ margin: 0 }}>All Expenses</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="month" className="input-field" style={{ margin: 0, padding: '0.25rem 0.5rem' }} value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
          <select className="input-field" style={{ margin: 0, padding: '0.25rem 0.5rem' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>
      
      <div className="transaction-list">
        {transactions.length > 0 ? transactions.map(t => (
          <div key={t._id} className="transaction-item">
            <div className="t-info">
              <span className="t-title">{t.category}</span>
              {t.description && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.description}</span>}
              <span className="t-date">{new Date(t.date).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`t-amount expense`}>
                -₹{t.amount.toFixed(2)}
              </span>
              <button className="btn-danger" style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }} onClick={() => handleDelete(t._id)}>Delete</button>
            </div>
          </div>
        )) : <p className="subtext">No expenses found for this month.</p>}
      </div>
    </div>
  );
}
