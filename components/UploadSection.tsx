import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseFile } from '../services/fileService';
import { Transaction } from '../types';

interface UploadSectionProps {
  onUploadSuccess: (data: Transaction[]) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const transactions = await parseFile(file);
      onUploadSuccess(transactions);
    } catch (err: any) {
      setError(err.message || "Gagal memproses file.");
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">ERP Keuangan Cerdas</h1>
        <p className="text-slate-500 text-lg">Kelola keuangan Anda dengan bantuan AI. Mulai dengan upload data.</p>
      </div>

      <div 
        className={`
          w-full max-w-xl p-10 border-2 border-dashed rounded-2xl transition-all duration-300
          flex flex-col items-center justify-center cursor-pointer bg-white
          ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:shadow-lg'}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".csv, .xlsx, .xls"
          onChange={onSelectFile}
        />
        
        {loading ? (
          <div className="flex flex-col items-center animate-pulse">
            <FileSpreadsheet size={64} className="text-brand-500 mb-4" />
            <p className="text-xl font-medium text-slate-700">Menganalisis Data...</p>
            <p className="text-sm text-slate-400">Mohon tunggu sebentar</p>
          </div>
        ) : (
          <>
            <div className="bg-brand-100 p-4 rounded-full mb-6">
              <Upload size={40} className="text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Klik atau Drop File di Sini
            </h3>
            <p className="text-slate-500 mb-6 text-center max-w-sm">
              Mendukung format <strong>.CSV</strong> atau <strong>.XLSX</strong>.<br/>
              Pastikan ada kolom: Tanggal, Deskripsi, Jumlah, Kategori.
            </p>
            <button className="px-6 py-2 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30">
              Pilih File
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center animate-bounce-in">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sample Template Info */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-center">
          <div className="text-brand-500 font-bold mb-1">Step 1</div>
          <div className="text-sm text-slate-600">Siapkan File Excel/CSV</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-center">
          <div className="text-brand-500 font-bold mb-1">Step 2</div>
          <div className="text-sm text-slate-600">Upload ke Sistem</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-center">
          <div className="text-brand-500 font-bold mb-1">Step 3</div>
          <div className="text-sm text-slate-600">Dapat Insight AI</div>
        </div>
      </div>
    </div>
  );
};
