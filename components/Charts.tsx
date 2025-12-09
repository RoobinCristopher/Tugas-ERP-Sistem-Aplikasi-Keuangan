import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Transaction } from '../types';

interface ChartsProps {
  transactions: Transaction[];
}

export const FinancialCharts: React.FC<ChartsProps> = ({ transactions }) => {
  // Process data for Line Chart (Cashflow over time)
  const sortedTrans = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group by date for the line chart
  const groupedByDate: Record<string, { date: string; income: number; expense: number }> = {};
  
  sortedTrans.forEach(t => {
    if (!groupedByDate[t.date]) {
      groupedByDate[t.date] = { date: t.date, income: 0, expense: 0 };
    }
    if (t.amount > 0) groupedByDate[t.date].income += t.amount;
    else groupedByDate[t.date].expense += Math.abs(t.amount);
  });

  const lineChartData = Object.values(groupedByDate);

  // Process data for Bar Chart (Category Analysis)
  const groupedByCategory: Record<string, number> = {};
  sortedTrans.forEach(t => {
    if (t.amount < 0) { // Only analyze expenses for category chart usually
      const cat = t.category;
      groupedByCategory[cat] = (groupedByCategory[cat] || 0) + Math.abs(t.amount);
    }
  });

  const barChartData = Object.keys(groupedByCategory)
    .map(key => ({ name: key, value: groupedByCategory[key] }))
    .sort((a, b) => b.value - a.value) // Sort desc
    .slice(0, 5); // Top 5

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Cash Flow Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          📈 Arus Kas Harian
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 12}} 
                tickFormatter={(val) => new Date(val).getDate().toString()}
              />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip 
                formatter={(value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" name="Pemasukan" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Pengeluaran" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          📊 Top 5 Pengeluaran Kategori
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
              <Tooltip 
                 formatter={(value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)}
                 cursor={{fill: '#f1f5f9'}}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Total" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
