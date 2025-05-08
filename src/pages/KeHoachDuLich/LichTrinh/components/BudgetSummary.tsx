import React from 'react';
import { Card, Divider, Progress } from 'antd';
import { BudgetStats } from '@/services/KeHoachDuLich/LichTrinh/typings';

interface BudgetSummaryProps {
  budget: BudgetStats;
  duration: number;
  totalBudget?: number | string;
  travelDistance?: number;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ budget, duration, totalBudget, travelDistance = 0 }) => {
  const { food, transport, accommodation, total } = budget;
  
  const safeTotal = total || 1;

  const foodPercent = Math.round((food / safeTotal) * 100);
  const transportPercent = Math.round((transport / safeTotal) * 100);
  const accommodationPercent = Math.round((accommodation / safeTotal) * 100);
  
  const numericTotalBudget = typeof totalBudget === 'string' 
    ? parseInt(totalBudget) 
    : totalBudget;

  const isOverBudget = numericTotalBudget ? total > numericTotalBudget : false;
  const budgetUsagePercent = numericTotalBudget 
    ? Math.min(100, Math.round((total / numericTotalBudget) * 100)) 
    : 0;
  
  return (
    <Card title="Thông tin chi phí và di chuyển" style={{ marginTop: 16 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Tổng thời gian tham quan: {duration} giờ</div>
          <div>Khoảng cách di chuyển: {travelDistance} đơn vị</div>
        </div>
        
        <Divider />
        
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Ăn uống:</span>
            <span>{food.toLocaleString('vi-VN')} VND ({foodPercent}%)</span>
          </div>
          <Progress percent={foodPercent} showInfo={false} strokeColor="#1890ff" />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Di chuyển:</span>
            <span>{transport.toLocaleString('vi-VN')} VND ({transportPercent}%)</span>
          </div>
          <Progress percent={transportPercent} showInfo={false} strokeColor="#52c41a" />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Lưu trú:</span>
            <span>{accommodation.toLocaleString('vi-VN')} VND ({accommodationPercent}%)</span>
          </div>
          <Progress percent={accommodationPercent} showInfo={false} strokeColor="#fa8c16" />
        </div>
        
        <Divider />
        
        <div><strong>Tổng chi phí: {total.toLocaleString('vi-VN')} VND</strong></div>
        
        {numericTotalBudget && (
          <>
            <Divider />
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Ngân sách dự kiến:</span>
                <span>{numericTotalBudget.toLocaleString('vi-VN')} VND</span>
              </div>
              <Progress 
                percent={budgetUsagePercent} 
                status={isOverBudget ? "exception" : "active"} 
                strokeColor={isOverBudget ? "#f5222d" : "#52c41a"}
              />
              {isOverBudget && (
                <div style={{ color: '#f5222d', marginTop: 8 }}>
                  Cảnh báo: Chi phí đã vượt quá ngân sách dự kiến {(total - numericTotalBudget).toLocaleString('vi-VN')} VND
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default BudgetSummary; 