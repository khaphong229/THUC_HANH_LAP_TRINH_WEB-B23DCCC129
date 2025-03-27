import React from 'react';
import { Form, Input, Button, InputNumber, Space, Select, Card, Typography } from 'antd';
import { DollarOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import type { NhanVien } from '@/services/NhanVien/typing';

const { Title } = Typography;
const { Option } = Select;

interface ServiceFormProps {
  form: any;
  loading: boolean;
  editId: string | null;
  employees: NhanVien.Employee[];
  onFinish: (values: any) => void;
  onCancelEdit: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  form,
  loading,
  editId,
  employees,
  onFinish,
  onCancelEdit,
}) => {
  return (
    <Card>
      <Title level={4}>{editId ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ'}</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
            parser={(value) => {
              if (value) {
                return value.replace(/\$\s?|(,*)/g, '');
              }
              return '';
            }}
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
            placeholder="Thời gian thực hiện"
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item
          name="employee_id"
          label="Người thực hiện"
          rules={[{ required: true, message: 'Vui lòng chọn người thực hiện' }]}
        >
          <Select
            placeholder="Chọn nhân viên thực hiện"
            loading={loading}
            style={{ width: '100%' }}
          >
            {employees.map(employee => (
              <Option key={employee.id} value={employee.id}>
                {employee.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editId ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            {editId && <Button onClick={onCancelEdit}>Hủy</Button>}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ServiceForm; 