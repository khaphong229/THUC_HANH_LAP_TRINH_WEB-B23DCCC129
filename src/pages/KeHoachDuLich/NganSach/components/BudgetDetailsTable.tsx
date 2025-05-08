// src/pages/BudgetManagement/components/BudgetDetailsTable.tsx
import React, { useState } from 'react';
import { Table, Tag, Tooltip, Button, Modal, Form, InputNumber, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useBudget,BudgetCategory } from './BudgetContext';

const { Text } = Typography;

const BudgetDetailsTable: React.FC = () => {
  const { categories, updateCategory, setBudgetForCategory } = useBudget();
  const [form] = Form.useForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<BudgetCategory | null>(null);
  const [editType, setEditType] = useState<'budget' | 'spent'>('budget');

  // Format số tiền sang VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Mở modal chỉnh sửa ngân sách hoặc chi tiêu
  const showEditModal = (category: BudgetCategory, type: 'budget' | 'spent') => {
    setCurrentCategory(category);
    setEditType(type);
    setEditModalVisible(true);
    form.setFieldsValue({ 
      amount: type === 'budget' ? category.budget : category.spent 
    });
  };

  // Xử lý khi lưu thay đổi
  const handleEditSave = () => {
    form.validateFields().then(values => {
      if (currentCategory) {
        if (editType === 'budget') {
          setBudgetForCategory(currentCategory.id, values.amount);
        } else {
          updateCategory(currentCategory.id, values.amount);
        }
        setEditModalVisible(false);
        form.resetFields();
      }
    });
  };

  // Cột cho bảng
  const columns = [
    {
      title: 'Danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: BudgetCategory) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            style={{ 
              width: 16, 
              height: 16, 
              backgroundColor: record.color, 
              borderRadius: '50%',
              marginRight: 8
            }} 
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Ngân sách',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget: number, record: BudgetCategory) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>{formatCurrency(budget)}</Text>
          <Tooltip title="Chỉnh sửa ngân sách">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => showEditModal(record, 'budget')} 
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Đã chi tiêu',
      dataIndex: 'spent',
      key: 'spent',
      render: (spent: number, record: BudgetCategory) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>{formatCurrency(spent)}</Text>
          <Tooltip title="Cập nhật chi tiêu">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => showEditModal(record, 'spent')}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Còn lại',
      key: 'remaining',
      render: (_:any, record: BudgetCategory) => {
        const remaining = record.budget - record.spent;
        const isOverBudget = remaining < 0;
        
        return (
          <Text type={isOverBudget ? 'danger' : 'success'}>
            {formatCurrency(remaining)}
          </Text>
        );
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_:any, record: BudgetCategory) => {
        const { budget, spent } = record;
        const percentage = (spent / budget) * 100;
        
        let status: 'success' | 'warning' | 'error' = 'success';
        let text = 'Ổn định';
        
        if (percentage >= 100) {
          status = 'error';
          text = 'Vượt ngân sách';
        } else if (percentage >= 80) {
          status = 'warning';
          text = 'Sắp vượt ngân sách';
        }
        
        return <Tag color={status}>{text}</Tag>;
      },
    },
  ];

  return (
    <>
      <Table 
        dataSource={categories} 
        columns={columns} 
        rowKey="id"
        pagination={false}
        bordered
        size="middle"
        responsive={['md']}
      />
      
      {/* Modal chỉnh sửa ngân sách/chi tiêu */}
      <Modal
        title={`${editType === 'budget' ? 'Chỉnh sửa ngân sách' : 'Cập nhật chi tiêu'} cho ${currentCategory?.name}`}
        visible={editModalVisible}
        onOk={handleEditSave}
        onCancel={() => setEditModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="amount"
            label={editType === 'budget' ? 'Ngân sách mới' : 'Chi tiêu thực tế'}
            rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
          >
            <InputNumber
              formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/₫\s?|(,*)/g, '')}
              style={{ width: '100%' }}
              min={0}
              step={100000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BudgetDetailsTable;