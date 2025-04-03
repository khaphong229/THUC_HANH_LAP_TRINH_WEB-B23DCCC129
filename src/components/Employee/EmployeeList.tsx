import React from "react";
import { Employee } from "@/services/EmployeeMana/typing";
import { Table, Button, Popconfirm, Space, Card, Typography } from 'antd';


const {Title} = Typography;

interface EmployeeListProps{
    employees: Employee[];
    loading: boolean;
    onDelete: (id:string) => void;
    onEdit: (employee:Employee)=>void

}

const EmployeeList: React.FC<EmployeeListProps> = ({
    employees,loading, onEdit,onDelete
}) =>{
    const columns = [
        {
            title:'mã',
            dataIndex:'employee_id',
            key:'employee_id',
            width:80
        },
        {
            title: ' Tên nhân viên',
            dataIndex:'full_name',
            key:'full_name',
            width:200,
        },
        {
            title:'Chức vụ',
            dataIndex:'position',
            key:'position',
            width:150
        },
        {
            title:'Phòng ban',
            dataIndex:'department',
            key:'department',
            width:150
        },
        {
            title: 'Lương',
            dataIndex: 'salary',
            key: 'salary',
            width: 100,
            sorter:(a:Employee, b:Employee) => (b.salary|| 0) - (a.salary|| 0),
            defaultSortOrder:"descend" as const,
            render: (salary?: number) => salary ? salary.toLocaleString() + " VND" : "N/A"
        },
        
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            width:100,
            render: (status: string) =>
              status === "probation" ? "Thử việc" : "Đã ký hợp đồng",
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
            pagination={{pageSize:5}}
            scroll={{x:80}}
            />
        </Card>
    )

}


export default EmployeeList