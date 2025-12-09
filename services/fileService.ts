import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Transaction } from '../types';
import { generateId, parseDateToISO } from '../utils';

// Helper to normalize keys to lowercase
const normalizeKeys = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    newObj[key.toLowerCase().trim()] = obj[key];
  });
  return newObj;
};

const validateAndMapRow = (row: any): Transaction | null => {
  const normalized = normalizeKeys(row);
  
  // Check for required fields (handling strict or fuzzy matching)
  // Required: Tanggal, Deskripsi, Jumlah, Kategori
  
  const dateVal = normalized['tanggal'] || normalized['date'];
  const descVal = normalized['deskripsi'] || normalized['description'] || normalized['desc'];
  const amountVal = normalized['jumlah'] || normalized['amount'] || normalized['nilai'];
  const catVal = normalized['kategori'] || normalized['category'];

  if (!dateVal || !descVal || amountVal === undefined || !catVal) {
    return null;
  }

  // Parse amount (handle string formatting like "Rp 10.000" or "(5000)")
  let cleanAmount = amountVal;
  if (typeof amountVal === 'string') {
    let s = amountVal.replace(/[^0-9.-]/g, ''); // Remove currency symbols
    if (amountVal.includes('(') && amountVal.includes(')')) {
        s = '-' + s; // Accounting format for negative
    }
    cleanAmount = parseFloat(s);
  }

  return {
    id: generateId(),
    date: parseDateToISO(dateVal),
    description: String(descVal),
    amount: Number(cleanAmount),
    category: String(catVal),
  };
};

export const parseFile = async (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const transactions: Transaction[] = [];
          const errors: string[] = [];

          results.data.forEach((row: any, index: number) => {
            const t = validateAndMapRow(row);
            if (t) transactions.push(t);
            else errors.push(`Row ${index + 1} missing required fields`);
          });

          if (transactions.length === 0) {
            reject(new Error("Tidak ada data valid ditemukan. Pastikan kolom: Tanggal, Deskripsi, Jumlah, Kategori ada."));
          } else {
            resolve(transactions);
          }
        },
        error: (err) => reject(err),
      });
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const transactions: Transaction[] = [];
          
          jsonData.forEach((row: any) => {
            const t = validateAndMapRow(row);
            if (t) transactions.push(t);
          });

          if (transactions.length === 0) {
            reject(new Error("Tidak ada data valid di Excel. Pastikan header kolom sesuai."));
          } else {
            resolve(transactions);
          }
        } catch (err) {
          reject(new Error("Gagal membaca file Excel."));
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Format file tidak didukung. Harap gunakan .csv atau .xlsx"));
    }
  });
};
