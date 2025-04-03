import React from 'react';
import { Form, Input, Button, InputNumber, Space, TimePicker, Select, Collapse, Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { dayMap } from '@/services/NhanVien/constants';

const { Option } = Select;
const { Title } = Typography;
const { Panel } = Collapse;

interface EmployeeFormProps {
  form: any;
  loading: boolean;
  editId: string | null;
  selectedDays: string[];
  onFinish: (values: any) => void;
  onDaysChange: (days: string[]) => void;
  onCancelEdit: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  form,
  loading,
  editId,
  selectedDays,
  onFinish,
  onDaysChange,
  onCancelEdit,
}) => {
  return (
    <Card>
      <Title level={4}>{editId ? 'Sửa Nhân Viên' : 'Thêm Nhân Viên'}</Title>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item
          name='name'
          label='Tên nhân viên'
          rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
        >
          <Input prefix={<UserOutlined />} placeholder='Tên nhân viên' />
        </Form.Item>

        <Form.Item name='phone' label='Số điện thoại'>
          <Input placeholder='Số điện thoại' />
        </Form.Item>

        <Form.Item
          name='maxCustomers'
          label='Số khách tối đa/Ngày'
          rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa' }]}
        >
          <InputNumber min={1} placeholder='Số khách tối đa/ngày' style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label='Ngày làm việc'>
          <Select 
            mode='multiple' 
            placeholder='Chọn ngày làm việc' 
            onChange={onDaysChange} 
            value={selectedDays}
          >
            <Option value='Monday'>Thứ Hai</Option>
            <Option value='Tuesday'>Thứ Ba</Option>
            <Option value='Wednesday'>Thứ Tư</Option>
            <Option value='Thursday'>Thứ Năm</Option>
            <Option value='Friday'>Thứ Sáu</Option>
            <Option value='Saturday'>Thứ Bảy</Option>
            <Option value='Sunday'>Chủ Nhật</Option>
          </Select>
        </Form.Item>

        {selectedDays.length > 0 && (
          <Collapse defaultActiveKey={selectedDays}>
            {selectedDays.map((day) => (
              <Panel header={`Giờ làm việc - ${dayMap[day as keyof typeof dayMap]}`} key={day}>
                <Space style={{ width: '100%', display: 'flex' }}>
                  <Form.Item
                    name={`startTime_${day}`}
                    label='Giờ bắt đầu'
                    rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
                    style={{ width: '100%' }}
                  >
                    <TimePicker format='HH:mm' style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={`endTime_${day}`}
                    label='Giờ kết thúc'
                    rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
                    style={{ width: '100%' }}
                  >
                    <TimePicker format='HH:mm' style={{ width: '100%' }} />
                  </Form.Item>
                </Space>
              </Panel>
            ))}
          </Collapse>
        )}

        <Form.Item style={{ marginTop: 16 }}>
          <Space>
            <Button type='primary' htmlType='submit' loading={loading}>
              {editId ? 'Cập nhật' : 'Thêm'}
            </Button>
            {editId && <Button onClick={onCancelEdit}>Hủy</Button>}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EmployeeForm; 