import React, { useState, useEffect } from 'react';
import { 
  Table, Form, Input, Button, InputNumber, Space, 
  Popconfirm, message, TimePicker, Select
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
// import './index.less';

const { Option } = Select;
const API_URL = 'https://67d23b2f90e0670699bcba98.mockapi.io/api/v1/tiem-nail/nhan-vien';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState(null);
  
  
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };
  
  
  const addEmployee = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        ...values,
        workDays: values.workDays.join(', '),
        workHours: `${values.startTime.format('HH:mm')}-${values.endTime.format('HH:mm')}`
      });
      setEmployees([...employees, response.data]);
      message.success('Thêm nhân viên thành công');
      form.resetFields();
    } catch (error) {
      console.error('Error adding employee:', error);
      message.error('Không thể thêm nhân viên');
    } finally {
      setLoading(false);
    }
  };
  
  
  const updateEmployee = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/${editId}`, {
        ...values,
        workDays: values.workDays.join(', '),
        workHours: `${values.startTime.format('HH:mm')}-${values.endTime.format('HH:mm')}`
      });
      setEmployees(employees.map(emp => emp.id === editId ? response.data : emp));
      message.success('Cập nhật nhân viên thành công');
      form.resetFields();
      setEditId(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      message.error('Không thể cập nhật nhân viên');
    } finally {
      setLoading(false);
    }
  };
  
  
  const deleteEmployee = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
      message.success('Xóa nhân viên thành công');
    } catch (error) {
      console.error('Error deleting employee:', error);
      message.error('Không thể xóa nhân viên');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleEdit = (record) => {
    setEditId(record.id);
    
    const [startTime, endTime] = record.workHours?.split('-') || ['09:00', '17:00'];
    form.setFieldsValue({
      name: record.name,
      maxCustomers: record.maxCustomers,
      workDays: record.workDays?.split(', ') || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: moment(startTime, 'HH:mm'),
      endTime: moment(endTime, 'HH:mm')
    });
  };
  
  
  const handleCancelEdit = () => {
    setEditId(null);
    form.resetFields();
  };
  
  
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
      title: 'Số khách tối đa/Ngày',
      dataIndex: 'maxCustomers',
      key: 'maxCustomers',
      width: 180,
    },
    {
      title: 'Ngày làm việc',
      dataIndex: 'workDays',
      key: 'workDays',
    },
    {
      title: 'Giờ làm việc',
      dataIndex: 'workHours',
      key: 'workHours',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => deleteEmployee(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  return (
    <>
      <div className="card">
        <div className="card-title">Thêm/Sửa Nhân Viên</div>
        <div className="card-content">
          <Form
            form={form}
            layout="vertical"
            onFinish={editId ? updateEmployee : addEmployee}
          >
            <Form.Item
              name="name"
              label="Tên nhân viên"
              rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên nhân viên" />
            </Form.Item>
            
            <Form.Item
              name="maxCustomers"
              label="Số khách tối đa/Ngày"
              rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa' }]}
            >
              <InputNumber min={1} placeholder="Số khách tối đa/ngày" className="full-width" />
            </Form.Item>
            
            <Form.Item
              name="workDays"
              label="Ngày làm việc"
              rules={[{ required: true, message: 'Vui lòng chọn ngày làm việc' }]}
            >
              <Select mode="multiple" placeholder="Chọn ngày làm việc">
                <Option value="Monday">Thứ Hai</Option>
                <Option value="Tuesday">Thứ Ba</Option>
                <Option value="Wednesday">Thứ Tư</Option>
                <Option value="Thursday">Thứ Năm</Option>
                <Option value="Friday">Thứ Sáu</Option>
                <Option value="Saturday">Thứ Bảy</Option>
                <Option value="Sunday">Chủ Nhật</Option>
              </Select>
            </Form.Item>
            
            <Space className="full-width">
              <Form.Item
                name="startTime"
                label="Giờ bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
                style={{ width: '100%' }}
              >
                <TimePicker format="HH:mm" className="full-width" />
              </Form.Item>
              
              <Form.Item
                name="endTime"
                label="Giờ kết thúc"
                rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
                style={{ width: '100%' }}
              >
                <TimePicker format="HH:mm" className="full-width" />
              </Form.Item>
            </Space>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editId ? 'Cập nhật' : 'Thêm'}
                </Button>
                {editId && <Button onClick={handleCancelEdit}>Hủy</Button>}
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
      
      <div className="card">
        <div className="card-title">Danh Sách Nhân Viên</div>
        <div className="card-content">
          <Table
            columns={columns}
            dataSource={employees}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 800 }}
          />
        </div>
      </div>
    </>
  );
}