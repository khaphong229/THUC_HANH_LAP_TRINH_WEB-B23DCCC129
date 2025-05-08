// src/pages/BudgetManagement/components/BudgetOverview.tsx
import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { 
  WalletOutlined, 
  DollarOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined 
} from '@ant-design/icons';
import { useBudget } from './BudgetContext';

const BudgetOverview: React.FC = () => {
  const { totalBudget, totalSpent, remainingBudget } = useBudget();
  
  // Tính tỷ lệ phần trăm đã chi tiêu
  const spentPercentage = totalBudget > 0 
    ? Math.round((totalSpent / totalBudget) * 100) 
    : 0;
  
  // Đổi màu tiến trình dựa trên tỷ lệ chi tiêu
  const getProgressColor = () => {
    if (spentPercentage >= 100) return '#f5222d'; // Đỏ
    if (spentPercentage >= 80) return '#faad14';  // Vàng
    return '#52c41a';  // Xanh lá
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

  return (
    <Row gutter={16}>
      <Col xs={24} sm={8}>
        <Card bordered={false}>
          <Statistic
            title="Tổng ngân sách"
            value={formatCurrency(totalBudget)}
            prefix={<WalletOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={8}>
        <Card bordered={false}>
          <Statistic
            title="Đã chi tiêu"
            value={formatCurrency(totalSpent)}
            prefix={<DollarOutlined />}
            valueStyle={{ 
              color: totalSpent > totalBudget ? '#cf1322' : '#3f8600' 
            }}
            suffix={
              totalSpent > totalBudget ? 
                <ArrowUpOutlined style={{ fontSize: 16 }} /> : 
                <ArrowDownOutlined style={{ fontSize: 16 }} />
            }
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={8}>
        <Card bordered={false}>
          <Statistic
            title="Ngân sách còn lại"
            value={formatCurrency(remainingBudget)}
            valueStyle={{ 
              color: remainingBudget < 0 ? '#cf1322' : '#3f8600' 
            }}
          />
          <Progress 
            percent={spentPercentage} 
            status={spentPercentage >= 100 ? "exception" : "active"}
            strokeColor={getProgressColor()}
            format={percent => `${percent}%`}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default BudgetOverview;