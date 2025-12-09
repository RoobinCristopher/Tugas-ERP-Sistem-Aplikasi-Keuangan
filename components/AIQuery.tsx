import React, { useState } from 'react';
import { Send, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import { Transaction } from '../types';
import { analyzeDataWithGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AIQueryProps {
  transactions: Transaction[];
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export const AIQuery: React.FC<AIQueryProps> = ({ transactions }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Halo! Saya asisten keuangan pribadimu. Tanyakan apa saja tentang data keuangan yang baru kamu upload. Contoh: "Berapa total pengeluaran makan?" atau "Tampilkan transaksi terbesar bulan ini".' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await analyzeDataWithGemini(userMsg, transactions);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Maaf, terjadi kesalahan koneksi.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-brand-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="text-yellow-300" size={20} />
          <h3 className="font-bold">FinAI Assistant</h3>
        </div>
        <span className="text-xs bg-brand-700 px-2 py-1 rounded-md">Powered by Gemini</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] rounded-2xl p-4 shadow-sm
              ${msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}
            `}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span>{msg.role === 'user' ? 'Anda' : 'Asisten Keuangan'}</span>
              </div>
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 text-inherit">
                 <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-brand-600" />
              <span className="text-sm text-slate-500">Sedang menganalisis data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 relative">
          <input
            type="text"
            className="flex-1 p-3 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="Tanya tentang keuanganmu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:bg-slate-300 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};