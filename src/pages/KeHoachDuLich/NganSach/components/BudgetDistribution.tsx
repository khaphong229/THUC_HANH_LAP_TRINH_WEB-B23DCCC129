// src/pages/BudgetManagement/components/BudgetDistribution.tsx
import React, { useState } from 'react';
import { Pie, Bar } from '@ant-design/plots';
import { Radio, RadioChangeEvent, Empty } from 'antd';
import { useBudget } from './BudgetContext';


type ChartType = 'pie' | 'bar';

const BudgetDistribution: React.FC = () => {
  const [chartType, setChartType] = useState<ChartType>('pie');
  const { categories } = useBudget();

  // Xử lý khi thay đổi loại biểu đồ
  const handleChartTypeChange = (e: RadioChangeEvent) => {
    setChartType(e.target.value);
  };

  // Format số tiền sang VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Kiểm tra nếu không có dữ liệu
  if (categories.length === 0) {
    return <Empty description="Không có dữ liệu ngân sách" />;
  }

  // Cấu hình cho biểu đồ tròn
  const pieConfig = {
    data: categories,
    angleField: 'spent',
    colorField: 'name',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    legend: { position: 'bottom' as const },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.name, value: formatCurrency(datum.spent) };
      },
    },
  };

  // Cấu hình cho biểu đồ cột
  const barConfig = {
    data: categories.map(cat => ({
      category: cat.name,
      budget: cat.budget,
      spent: cat.spent,
    })),
    isGroup: true,
    xField: 'category',
    yField: 'value',
    seriesField: 'type',
    legend: { position: 'bottom' as const },
    label: { position: 'middle', layout: [{ type: 'interval-adjust-position' }] },
    tooltip: {
      formatter: (datum: any) => {
        return { 
          name: datum.type === 'budget' ? 'Ngân sách' : 'Đã chi',
          value: formatCurrency(datum.value)
        };
      },
    },
  };

  // Chuyển đổi dữ liệu cho biểu đồ cột
  const barData = categories.flatMap(cat => [
    { category: cat.name, value: cat.budget, type: 'budget' },
    { category: cat.name, value: cat.spent, type: 'spent' }
  ]);


  return (
    <div className="budget-distribution">
      <Radio.Group 
        value={chartType} 
        onChange={handleChartTypeChange}
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="pie">Biểu đồ tròn</Radio.Button>
        <Radio.Button value="bar">Biểu đồ cột</Radio.Button>
      </Radio.Group>

      <div style={{ height: 300 }}>
        {chartType === 'pie' ? (
          <Pie {...pieConfig} />
        ) : (
          <Bar 
            {...barConfig}
            data={barData}
            color={['#1890ff', '#52c41a']}
          />
        )}
      </div>
    </div>
  );
};

export default BudgetDistribution;