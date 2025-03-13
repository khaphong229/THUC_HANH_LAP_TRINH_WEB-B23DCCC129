import React from 'react';
import { Table, Button, Popconfirm, Space, Card, Typography } from 'antd';
import type { NhanVien } from '@/services/NhanVien/typing';
import WorkScheduleDisplay from './WorkScheduleDisplay';

const { Title } = Typography;

interface EmployeeListProps {
  employees: NhanVien.Employee[];
  loading: boolean;
  onEdit: (record: NhanVien.Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Số khách tối đa/Ngày',
      key: 'max_customers',
      render: (_: any, record: NhanVien.Employee) => record.maxCustomers || 0,
      width: 180,
    },
    {
      title: 'Lịch làm việc',
      key: 'work_date',
      render: (_: any, record: NhanVien.Employee) => <WorkScheduleDisplay workDate={record.work_date} />,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_: any, record: NhanVien.Employee) => (
        <Space size='small'>
          <Button type='primary' onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa nhân viên này?'
            onConfirm={() => record.id && onDelete(record.id)}
            okText='Xóa'
            cancelText='Hủy'
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>Danh Sách Nhân Viên</Title>
      <Table
        columns={columns}
        dataSource={employees}
        rowKey='id'
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
};

export default EmployeeList; 