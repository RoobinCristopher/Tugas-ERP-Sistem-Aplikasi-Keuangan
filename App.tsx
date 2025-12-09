import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { UploadSection } from './components/UploadSection';
import { StatsCard } from './components/StatsCard';
import { FinancialCharts } from './components/Charts';
import { TransactionTable } from './components/TransactionTable';
import { AIQuery } from './components/AIQuery';
import { Transaction, AppView, SummaryStats } from './types';
import { formatCurrency } from './utils';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const stats: SummaryStats = useMemo(() => {
    if (!transactions) return { totalIncome: 0, totalExpense: 0, netCashFlow: 0, transactionCount: 0 };
    
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.amount > 0) totalIncome += t.amount;
      else totalExpense += Math.abs(t.amount);
    });

    return {
      totalIncome,
      totalExpense,
      netCashFlow: totalIncome - totalExpense,
      transactionCount: transactions.length
    };
  }, [transactions]);

  const handleLogout = () => {
    if (confirm('Yakin ingin mereset data dan kembali ke awal?')) {
      setTransactions(null);
      setCurrentView(AppView.DASHBOARD);
    }
  };

  // If no transactions, show Upload Screen
  if (!transactions) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 text-white p-2 rounded-lg">
              <Wallet size={24} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">FinAI ERP</span>
          </div>
        </header>
        <main className="flex-1">
          <UploadSection onUploadSuccess={setTransactions} />
        </main>
      </div>
    );
  }

  // Dashboard / Authenticated Layout
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-brand-500 text-white p-2 rounded-lg">
            <Wallet size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">FinAI ERP</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.DASHBOARD ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setCurrentView(AppView.TRANSACTIONS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.TRANSACTIONS ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800'}`}
          >
            <Receipt size={20} />
            <span className="font-medium">Data Transaksi</span>
          </button>
          
          <button 
            onClick={() => setCurrentView(AppView.AI_ANALYSIS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.AI_ANALYSIS ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800'}`}
          >
            <Bot size={20} />
            <span className="font-medium">AI Analysis</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/30 text-red-400 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Reset Data</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 text-white p-1.5 rounded-lg">
              <Wallet size={20} />
            </div>
            <span className="font-bold text-slate-800">FinAI ERP</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 z-10 shadow-xl p-4 space-y-2">
             <button onClick={() => { setCurrentView(AppView.DASHBOARD); setIsMobileMenuOpen(false); }} className="block w-full text-left p-3 rounded-lg hover:bg-slate-50 font-medium text-slate-700">Dashboard</button>
             <button onClick={() => { setCurrentView(AppView.TRANSACTIONS); setIsMobileMenuOpen(false); }} className="block w-full text-left p-3 rounded-lg hover:bg-slate-50 font-medium text-slate-700">Transaksi</button>
             <button onClick={() => { setCurrentView(AppView.AI_ANALYSIS); setIsMobileMenuOpen(false); }} className="block w-full text-left p-3 rounded-lg hover:bg-slate-50 font-medium text-slate-700">AI Analysis</button>
             <div className="h-px bg-slate-100 my-2"></div>
             <button onClick={handleLogout} className="block w-full text-left p-3 rounded-lg hover:bg-red-50 font-medium text-red-600">Reset Data</button>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Dashboard View */}
          {currentView === AppView.DASHBOARD && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Ringkasan Keuangan</h2>
                  <p className="text-slate-500">Overview performa keuangan dari data yang diupload.</p>
                </div>
                <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                  Last Updated: {new Date().toLocaleDateString('id-ID')}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard 
                  title="Total Pemasukan" 
                  value={formatCurrency(stats.totalIncome)}
                  icon={TrendingUp}
                  colorClass="text-emerald-600"
                  bgClass="bg-emerald-50"
                />
                <StatsCard 
                  title="Total Pengeluaran" 
                  value={formatCurrency(stats.totalExpense)}
                  icon={TrendingDown}
                  colorClass="text-red-600"
                  bgClass="bg-red-50"
                />
                <StatsCard 
                  title="Net Cash Flow" 
                  value={formatCurrency(stats.netCashFlow)}
                  icon={Wallet}
                  colorClass={stats.netCashFlow >= 0 ? "text-blue-600" : "text-amber-600"}
                  bgClass={stats.netCashFlow >= 0 ? "bg-blue-50" : "bg-amber-50"}
                />
              </div>

              <FinancialCharts transactions={transactions} />

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Transaksi Terbaru</h3>
                <TransactionTable transactions={transactions.slice(0, 5)} />
              </div>
            </div>
          )}

          {/* Transactions View */}
          {currentView === AppView.TRANSACTIONS && (
            <div className="space-y-6 animate-fade-in">
               <div>
                  <h2 className="text-2xl font-bold text-slate-800">Data Transaksi</h2>
                  <p className="text-slate-500">Daftar lengkap transaksi yang telah diproses.</p>
                </div>
              <TransactionTable transactions={transactions} />
            </div>
          )}

          {/* AI View */}
          {currentView === AppView.AI_ANALYSIS && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Analisis Keuangan AI</h2>
                  <p className="text-slate-500">Tanyakan apa saja mengenai data keuangan Anda.</p>
              </div>
              <AIQuery transactions={transactions} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
