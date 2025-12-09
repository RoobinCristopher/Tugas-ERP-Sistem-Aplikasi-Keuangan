import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
}

const ITEMS_PER_PAGE = 10;

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h3>
        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Total: {transactions.length} Data
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Deskripsi</th>
              <th className="px-6 py-4 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                  {formatDate(t.date)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-800">
                  {t.description}
                </td>
                <td className={`px-6 py-4 text-sm font-semibold text-right whitespace-nowrap ${
                  t.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  <div className="flex items-center justify-end gap-1">
                    {t.amount >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownLeft size={14}/>}
                    {formatCurrency(t.amount)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-slate-600 font-medium">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
