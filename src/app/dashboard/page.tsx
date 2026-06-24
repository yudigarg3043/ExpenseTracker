'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TransactionModal from '@/components/TransactionModal';
import BudgetModal from '@/components/BudgetModal';
import CategoryModal from '@/components/CategoryModal';
import { exportToExcel } from '@/lib/export';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budget, setBudget] = useState(0);
  const [isTModalOpen, setTModalOpen] = useState(false);
  const [isBModalOpen, setBModalOpen] = useState(false);
  const [isCModalOpen, setCModalOpen] = useState(false);
  
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [filterCategory, setFilterCategory] = useState('All');
  const [categories, setCategories] = useState<any[]>([]);

  const fetchData = async () => {
    const tRes = await fetch(`/api/transactions?month=${filterMonth}&category=${filterCategory}`);
    const tData = await tRes.json();
    setTransactions(tData);

    const bRes = await fetch('/api/budget');
    const bData = await bRes.json();
    setBudget(bData.monthlyBudget);
    
    const cRes = await fetch('/api/categories');
    const cData = await cRes.json();
    setCategories([...cData.defaults, ...cData.custom]);
  };

  useEffect(() => {
    fetchData();
  }, [filterMonth, filterCategory]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Chart Data
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    
  const chartData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));
  
  const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#3b82f6', '#10b981'];

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setTModalOpen(true)}>+ Add Transaction</button>
        <button className="btn-secondary" onClick={() => setBModalOpen(true)}>Set Budget</button>
        <button className="btn-secondary" onClick={() => setCModalOpen(true)}>+ New Category</button>
        <button className="btn-secondary" style={{ marginLeft: 'auto', background: 'var(--success)' }} onClick={() => exportToExcel(transactions, categories)}>Export to Excel</button>
      </div>

      <div className="grid-cards">
        <div className="stat-card glass-panel">
          <span className="stat-title">Current Balance</span>
          <span className={`stat-value ${balance < 0 ? 'expense' : 'income'}`}>₹{balance.toFixed(2)}</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-title">Total Income</span>
          <span className="stat-value income">₹{totalIncome.toFixed(2)}</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-title">Total Expenses</span>
          <span className="stat-value expense">₹{totalExpense.toFixed(2)}</span>
          {budget > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: totalExpense > budget ? 'var(--danger)' : 'var(--success)' }}>
              Budget: ₹{budget.toFixed(2)} {totalExpense > budget ? '(Over Budget!)' : ''}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: '1 1 400px' }}>
          <h2 className="heading">Expenses by Category</h2>
          {chartData.length > 0 ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <p className="subtext">No expenses to display for this month.</p>
          )}
        </div>

        <div className="glass-panel" style={{ flex: '1 1 400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="heading" style={{ margin: 0 }}>Recent Transactions</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="month" className="input-field" style={{ margin: 0, padding: '0.25rem 0.5rem' }} value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
              <select className="input-field" style={{ margin: 0, padding: '0.25rem 0.5rem' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="All">All Categories</option>
                {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="transaction-list">
            {transactions.length > 0 ? transactions.slice(0, 10).map(t => (
              <div key={t._id} className="transaction-item">
                <div className="t-info">
                  <span className="t-title">{t.category}</span>
                  {t.description && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.description}</span>}
                  <span className="t-date">{new Date(t.date).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`t-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                  </span>
                  <button className="btn-danger" style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }} onClick={() => handleDelete(t._id)}>Delete</button>
                </div>
              </div>
            )) : <p className="subtext">No transactions found.</p>}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/dashboard/expenses" className="btn-secondary">View All Expenses</Link>
            <Link href="/dashboard/income" className="btn-secondary">View All Income</Link>
          </div>
        </div>
      </div>

      <TransactionModal isOpen={isTModalOpen} onClose={() => setTModalOpen(false)} onRefresh={fetchData} />
      <BudgetModal isOpen={isBModalOpen} onClose={() => setBModalOpen(false)} onRefresh={fetchData} />
      <CategoryModal isOpen={isCModalOpen} onClose={() => setCModalOpen(false)} />
    </>
  );
}
