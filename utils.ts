import { Transaction } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Heuristic to parse loose date formats to YYYY-MM-DD
export const parseDateToISO = (rawDate: string | number | Date): string => {
  if (rawDate instanceof Date) {
    return rawDate.toISOString().split('T')[0];
  }
  
  const str = String(rawDate).trim();
  
  // Try standard Date parse
  const dateObj = new Date(str);
  if (!isNaN(dateObj.getTime())) {
    return dateObj.toISOString().split('T')[0];
  }

  // Handle DD/MM/YYYY or DD-MM-YYYY
  const parts = str.split(/[-/]/);
  if (parts.length === 3) {
    // Assume DD/MM/YYYY if year is last
    if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }

  return new Date().toISOString().split('T')[0]; // Fallback to today
};
