// src/components/club/ClubForm.tsx
import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Switch, Button, Space } from 'antd';
import { ClubFormValues } from '../../models/club';
import TinyEditor from '../TinyEditor/index';
import UploadFile from '../common/uploadfile';
import moment from 'moment';

interface ClubFormProps {
  initialValues?: ClubFormValues;
  onFinish: (values: ClubFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ClubForm: React.FC<ClubFormProps> = ({
  initialValues,
  onFinish,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        foundedDate: initialValues.foundedDate ? moment(initialValues.foundedDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    const formData: ClubFormValues = {
      ...values,
      foundedDate: values.foundedDate ? values.foundedDate.format('YYYY-MM-DD') : '',
      id: initialValues?.id,
    };
    
    onFinish(formData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ active: true }}
    >
      <Form.Item
        name="avatar"
        label="Ảnh đại diện"
        rules={[{ required: true, message: 'Vui lòng tải lên ảnh đại diện' }]}
      >
        <UploadFile />
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên câu lạc bộ"
        rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
      >
        <Input placeholder="Nhập tên câu lạc bộ" />
      </Form.Item>

      <Form.Item
        name="foundedDate"
        label="Ngày thành lập"
        rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô tả"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
      >
        <TinyEditor />
      </Form.Item>

      <Form.Item
        name="leader"
        label="Chủ nhiệm CLB"
        rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
      >
        <Input placeholder="Nhập tên chủ nhiệm" />
      </Form.Item>

      <Form.Item name="active" label="Hoạt động" valuePropName="checked">
        <Switch checkedChildren="Có" unCheckedChildren="Không" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ClubForm;