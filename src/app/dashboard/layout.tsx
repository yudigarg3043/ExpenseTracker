'use client';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="dashboard-layout">
      <header className="header">
        <h1 className="heading" style={{ margin: 0 }}>Expense Tracker</h1>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
