import React, { useState, useEffect } from 'react';
import { 
  Table, Form, Input, Button, InputNumber, Space, 
  Popconfirm, message, Card, Typography
} from 'antd';
import { DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const API_URL = 'https://67d23b2f90e0670699bcba98.mockapi.io/api/v1/tiem-nail/dich-vu';

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState(null);
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setServices(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dịch vụ:', error);
      message.error('Không thể tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };
  
  const addService = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, values);
      setServices([...services, response.data]);
      message.success('Thêm dịch vụ thành công');
      form.resetFields();
    } catch (error) {
      console.error('Lỗi khi thêm dịch vụ:', error);
      message.error('Không thể thêm dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/${editId}`, values);
      setServices(services.map(srv => srv.id === editId ? response.data : srv));
      message.success('Cập nhật dịch vụ thành công');
      form.resetFields();
      setEditId(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật dịch vụ:', error);
      message.error('Không thể cập nhật dịch vụ');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteService = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setServices(services.filter(srv => srv.id !== id));
      message.success('Xóa dịch vụ thành công');
    } catch (error) {
      console.error('Lỗi khi xóa dịch vụ:', error);
      message.error('Không thể xóa dịch vụ');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (record) => {
    setEditId(record.id);
    form.setFieldsValue({
      name: record.name,
      cost: record.cost,
      process_time: record.process_time
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
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost) => `${cost?.toLocaleString()} VNĐ`,
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'process_time',
      key: 'process_time',
      render: (process_time) => `${process_time} phút`,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa dịch vụ này?"
            onConfirm={() => deleteService(record.id)}
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
    fetchServices();
  }, []);
  
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Title level={4}>Thêm/Sửa Dịch Vụ</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={editId ? updateService : addService}
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
          >
            <Input placeholder="Tên dịch vụ" />
          </Form.Item>
          
          <Form.Item
            name="cost"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              prefix={<DollarOutlined />}
              placeholder="Giá dịch vụ"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="process_time"
            label="Thời gian (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          >
            <InputNumber
              min={1}
              prefix={<ClockCircleOutlined />}
              placeholder="Thời gian thực hiện"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              {editId && <Button onClick={handleCancelEdit}>Hủy</Button>}
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
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
    </Space>
  );
}