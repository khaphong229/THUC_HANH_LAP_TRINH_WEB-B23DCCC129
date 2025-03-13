import React from 'react';
import { Table, Button, Popconfirm, Space, Card, Typography } from 'antd';
import type { DichVu } from '@/services/DichVu/typing';

const { Title } = Typography;

interface ServiceListProps {
  services: DichVu.Service[];
  loading: boolean;
  getEmployeeName: (employeeId: string) => string;
  onEdit: (record: DichVu.Service) => void;
  onDelete: (id: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ 
  services, 
  loading, 
  getEmployeeName,
  onEdit, 
  onDelete 
}) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => `${cost?.toLocaleString()} VNĐ`,
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'process_time',
      key: 'process_time',
      render: (process_time: number) => `${process_time} phút`,
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'employee_id',
      key: 'employee_id',
      render: (employee_id: string) => getEmployeeName(employee_id),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_: any, record: DichVu.Service) => (
        <Space size="small">
          <Button type="primary" onClick={() => onEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa dịch vụ này?"
            onConfirm={() => record.id && onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>Danh Sách Dịch Vụ</Title>
      <Table
        columns={columns}
        dataSource={services}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
};

export default ServiceList; 