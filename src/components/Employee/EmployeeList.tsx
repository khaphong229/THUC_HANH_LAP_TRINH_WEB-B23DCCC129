import React from "react";
import { Employee } from "@/services/EmployeeMana/typing";
import { Table, Button, Popconfirm, Space, Card, Typography } from 'antd';
import { Tag } from 'antd';
const { Title } = Typography;

// Hàmchuyển  các mã viết tắt sang tên đầy đủ
const mapPositionToFullName = (position: string): string => {
  const positionMap: Record<string, string> = {
    'gd': 'Giám đốc',
    'pgd': 'Phó giám đốc',
    'tp': 'Trưởng phòng',
    'pp': 'Phó phòng',
    'nv': 'Nhân viên'
  };
  return positionMap[position] || position;
};

const mapDepartmentToFullName = (department: string): string => {
  const departmentMap: Record<string, string> = {
    'hcns': 'Hành chính nhân sự',
    'kt': 'Kế toán',
    'kd': 'Kinh doanh',
    'it': 'Công nghệ thông tin',
    'sxvh': 'Sản xuất và vận hành'
  };
  return departmentMap[department] || department;
};

interface EmployeeListProps {
  employees: Employee[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees, loading, onEdit, onDelete
}) => {
  const columns = [
    {
      title: 'Mã',
      dataIndex: 'employee_id',
      key: 'employee_id',
      width: 80,
      render: (id: string) => id.substring(0, 8) + '...' 
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 200,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
      width: 150,
      render: (position: string) => mapPositionToFullName(position) 
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (department: string) => mapDepartmentToFullName(department) 
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      width: 100,
      sorter: (a: Employee, b: Employee) => (b.salary || 0) - (a.salary || 0),
      defaultSortOrder: "descend" as const,
      render: (salary?: number) => salary ? salary.toLocaleString() + " VND" : "N/A"
    },
    {
    title: "Trạng Thái",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status: string) => {
        switch(status) {
        case "probation":
            return <Tag color="orange">Thử việc</Tag>;
        case "contract_signed":
            return <Tag color="green">Đã ký hợp đồng</Tag>;
        case "resigned":
            return <Tag color="red">Đã thôi việc</Tag>;
        default:
            return status;
        }
    }
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (record: Employee) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => onDelete(record.employee_id)}
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
      <Title level={4}>Danh sách nhân viên</Title>
      <Table
        columns={columns}
        dataSource={employees}
        rowKey="employee_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 800 }} 
      />
    </Card>
  );
};

export default EmployeeList;