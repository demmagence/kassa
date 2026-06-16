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

export const mockMonthlyCashFlow: CashFlowDataPoint[] = [
  { name: "Jan", income: 45000, expense: 32000, net: 13000 },
  { name: "Feb", income: 52000, expense: 34000, net: 18000 },
  { name: "Mar", income: 49000, expense: 36000, net: 13000 },
  { name: "Apr", income: 58000, expense: 41000, net: 17000 },
  { name: "May", income: 63000, expense: 39000, net: 24000 },
  { name: "Jun", income: 61000, expense: 42000, net: 19000 },
  { name: "Jul", income: 67000, expense: 45000, net: 22000 },
  { name: "Aug", income: 71000, expense: 46000, net: 25000 },
  { name: "Sep", income: 75000, expense: 48000, net: 27000 },
  { name: "Oct", income: 82000, expense: 51000, net: 31000 },
  { name: "Nov", income: 80000, expense: 53000, net: 27000 },
  { name: "Dec", income: 95000, expense: 58000, net: 37000 },
];

export const mockWeeklyCashFlow: CashFlowDataPoint[] = [
  { name: "Week 1", income: 18000, expense: 12000, net: 6000 },
  { name: "Week 2", income: 22000, expense: 14000, net: 8000 },
  { name: "Week 3", income: 19500, expense: 13000, net: 6500 },
  { name: "Week 4", income: 24500, expense: 15500, net: 9000 },
];

export const mockStats: DashboardStats = {
  netBalance: {
    value: 289450,
    change: 12.8,
    trend: "up",
  },
  totalIncome: {
    value: 95000,
    change: 18.2,
    trend: "up",
  },
  totalExpenses: {
    value: 58000,
    change: 9.4,
    trend: "up",
  },
  savingsRate: {
    value: 38.9,
    change: 4.1,
    trend: "up",
  },
};

export const mockTransactions: Transaction[] = [
  {
    id: "tx-101",
    date: "2026-06-15",
    description: "Cloud Server Hosting",
    category: "Infrastructure",
    type: "expense",
    amount: 1249.0,
    status: "completed",
  },
  {
    id: "tx-102",
    date: "2026-06-14",
    description: "Freelance UI Development - Client A",
    category: "Freelance",
    type: "income",
    amount: 5400.0,
    status: "completed",
  },
  {
    id: "tx-103",
    date: "2026-06-12",
    description: "Office Space Rent",
    category: "Rent & Facilities",
    type: "expense",
    amount: 3200.0,
    status: "completed",
  },
  {
    id: "tx-104",
    date: "2026-06-11",
    description: "Premium Stock Asset Pack",
    category: "Design Resources",
    type: "expense",
    amount: 149.0,
    status: "completed",
  },
  {
    id: "tx-105",
    date: "2026-06-10",
    description: "Consulting Retainer - Company B",
    category: "Consulting",
    type: "income",
    amount: 4500.0,
    status: "completed",
  },
  {
    id: "tx-106",
    date: "2026-06-08",
    description: "SaaS Subscription (Analytics Tools)",
    category: "Software",
    type: "expense",
    amount: 89.0,
    status: "completed",
  },
  {
    id: "tx-107",
    date: "2026-06-07",
    description: "Custom Web App Project - Client C",
    category: "Development",
    type: "income",
    amount: 12500.0,
    status: "completed",
  },
  {
    id: "tx-108",
    date: "2026-06-05",
    description: "Internet & Telecom Bills",
    category: "Utilities",
    type: "expense",
    amount: 180.0,
    status: "completed",
  },
  {
    id: "tx-109",
    date: "2026-06-04",
    description: "Social Media Ad Campaign",
    category: "Marketing",
    type: "expense",
    amount: 1200.0,
    status: "pending",
  },
  {
    id: "tx-110",
    date: "2026-06-02",
    description: "Client Project Refund - Cancelled Request",
    category: "Refunds",
    type: "expense",
    amount: 450.0,
    status: "failed",
  },
];
