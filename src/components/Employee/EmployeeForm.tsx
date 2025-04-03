import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, Card } from "antd";
import { Employee } from "@/services/EmployeeMana/typing";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

interface EmployeeFormProps {
  employee?: Employee;
  onSave: (employee: Employee) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (employee) {
      // Edit mode: set form values with existing employee data
      form.setFieldsValue(employee);
    } else {
      // Add mode: reset form and generate new UUID
      form.resetFields();
      // Generate a new UUID and set it to the form
      form.setFieldsValue({ employee_id: uuidv4() });
    }
  }, [employee, form]);

  const handleFinish = (values: Employee) => {
    // Pass the values directly to the parent component
    onSave(values);
    
    // Only reset the form when adding a new employee (not editing)
    if (!employee) {
      form.resetFields();
      form.setFieldsValue({ employee_id: uuidv4() });
    }
  };

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="employee_id"
          label="Mã NV"
          rules={[{ required: true, message: "Vui lòng nhập mã NV" }]}
        >
          <Input disabled />
        </Form.Item>
        {/* Rest of the form remains unchanged */}
        <Form.Item
          name="full_name"
          label="Họ tên"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên" },
            { max: 50, message: "Không nhập quá 50 ký tự" },
            { pattern: /^[\p{L} ]+$/u, message: "Không được chứa ký tự đặc biệt hoặc số" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="position"
          label="Chức vụ"
          rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
        >
          <Select>
            <Option value="gd">Giám đốc</Option>
            <Option value="pgd">Phó giám đốc</Option>
            <Option value="tp">Trưởng phòng</Option>
            <Option value="pp">Phó phòng</Option>
            <Option value="nv">Nhân viên</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="department"
          label="Phòng ban"
          rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
        >
          <Select>
            <Option value="hcns">Hành chính nhân sự</Option>
            <Option value="kt">Kế toán</Option>
            <Option value="kd">Kinh doanh</Option>
            <Option value="it">Công nghệ thông tin</Option>
            <Option value="sxvh">Sản xuất và vận hành</Option>
          </Select>
        </Form.Item>
        <Form.Item name="salary" label="Lương">
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select>
            <Option value="probation">Thử việc</Option>
            <Option value="contract_signed">Đã ký hợp đồng</Option>
            <Option value="resigned">Đã thôi việc</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          {employee ? "Cập nhật" : "Thêm mới"}
        </Button>
      </Form>
    </Card>
  );
};

export default EmployeeForm;