// src/pages/BudgetManagement/context/BudgetContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BudgetContextType, BudgetCategory } from '@/services/DuLich/KeHoachDuLich/NganSach/typing';

// Tạo context
const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Mock data ban đầu
const initialCategories: BudgetCategory[] = [
  { id: '1', name: 'Ăn uống', budget: 5000000, spent: 5500000, color: '#ff7875' },
  { id: '2', name: 'Di chuyển', budget: 3000000, spent: 2800000, color: '#52c41a' },
  { id: '3', name: 'Lưu trú', budget: 7000000, spent: 7200000, color: '#1890ff' },
  { id: '4', name: 'Vui chơi giải trí', budget: 2000000, spent: 2500000, color: '#faad14' },
  { id: '5', name: 'Mua sắm', budget: 1500000, spent: 1300000, color: '#722ed1' },
];

// Provider component
interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);

  // Cập nhật tổng số tiền khi categories thay đổi
  useEffect(() => {
    const budget = categories.reduce((sum, category) => sum + category.budget, 0);
    const spent = categories.reduce((sum, category) => sum + category.spent, 0);
    
    setTotalBudget(budget);
    setTotalSpent(spent);
    setRemainingBudget(budget - spent);
  }, [categories]);

  // Cập nhật số tiền đã chi cho danh mục
  const updateCategory = (id: string, spent: number) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === id ? { ...category, spent } : category
      )
    );
  };

  // Cập nhật ngân sách cho danh mục
  const setBudgetForCategory = (id: string, budget: number) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === id ? { ...category, budget } : category
      )
    );
  };

  // Lấy các danh mục vượt ngân sách
  const getOverBudgetCategories = (): BudgetCategory[] => {
    return categories.filter(category => category.spent > category.budget);
  };

  // Value object cung cấp cho context
  const contextValue: BudgetContextType = {
    categories,
    totalBudget,
    totalSpent,
    remainingBudget,
    updateCategory,
    setBudgetForCategory,
    getOverBudgetCategories
  };

  return (
    <BudgetContext.Provider value={contextValue}>
      {children}
    </BudgetContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};