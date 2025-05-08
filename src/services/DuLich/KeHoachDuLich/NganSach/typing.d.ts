// Định nghĩa kiểu dữ liệu
export interface BudgetCategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
}

export interface BudgetContextType {
  categories: BudgetCategory[];
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  updateCategory: (id: string, spent: number) => void;
  setBudgetForCategory: (id: string, budget: number) => void;
  getOverBudgetCategories: () => BudgetCategory[];
}
