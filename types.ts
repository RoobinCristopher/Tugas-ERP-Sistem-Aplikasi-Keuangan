export interface Transaction {
  id: string;
  date: string; // ISO YYYY-MM-DD
  description: string;
  amount: number;
  category: string;
}

export interface SummaryStats {
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  transactionCount: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRANSACTIONS = 'TRANSACTIONS',
  AI_ANALYSIS = 'AI_ANALYSIS',
}

export interface CategorySummary {
  name: string;
  value: number;
}

export interface ChartDataPoint {
  date: string;
  income: number;
  expense: number;
  net: number;
}
