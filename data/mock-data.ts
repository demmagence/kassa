export interface CashFlowDataPoint {
  name: string;
  income: number;
  expense: number;
  net: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  status: "completed" | "pending" | "failed";
}

export interface DashboardStats {
  netBalance: {
    value: number;
    change: number;
    trend: "up" | "down";
  };
  totalIncome: {
    value: number;
    change: number;
    trend: "up" | "down";
  };
  totalExpenses: {
    value: number;
    change: number;
    trend: "up" | "down";
  };
  savingsRate: {
    value: number;
    change: number;
    trend: "up" | "down";
  };
}


