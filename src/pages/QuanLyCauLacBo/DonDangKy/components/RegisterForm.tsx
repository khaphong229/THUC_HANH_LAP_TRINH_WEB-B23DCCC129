import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { RegisterFormProps, Clubs } from "@/services/DonDangKy/typing";
import axios from "axios";

const { Option } = Select;
const { TextArea } = Input;

const RegisterForm: React.FC<RegisterFormProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [clubs, setClubs] = useState<Clubs[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Pending");

  const fetchClub = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://67f729c442d6c71cca6435b5.mockapi.io/api/clb/cubs"
      );
      setClubs(res.data);
      console.log(res.data)
    } catch (error) {
      console.error("Không thể tải danh sách câu lạc bộ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
        setStatus(initialValues.status);
      } else {
        setStatus("Pending");
      }
      fetchClub();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Gán id nếu đang sửa
        const formValues = {
          ...values,
          id: initialValues?.id || undefined,
        };
        onSave(formValues);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  

  return (
    <Modal
      title={initialValues ? "Sửa đơn đăng ký" : "Thêm đơn đăng ký"}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Lưu
        </Button>,
      ]}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        name="registerForm"
        initialValues={initialValues || {}}
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
        >
          <Input />
        </Form.Item>

     

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value="Male">Nam</Option>
            <Option value="Female">Nữ</Option>
            <Option value="Other">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Thế mạnh"
          name="strengths"
          rules={[{ required: true, message: "Vui lòng nhập thế mạnh" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Câu lạc bộ"
          name="clubId"
          rules={[{ required: true, message: "Vui lòng chọn câu lạc bộ" }]}
        >
          <Select placeholder="Chọn câu lạc bộ" loading={loading}>
            {clubs.map((club) => (
              <Option key={club.id} value={club.name}>
                {club.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Lý do tham gia"
          name="reason"
          rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select onChange={(value) => setStatus(value)}>
            <Option value="Pending">Chờ duyệt</Option>
            <Option value="Approved">Chấp nhận</Option>
            <Option value="Rejected">Từ chối</Option>
          </Select>
        </Form.Item>

        {status === "Rejected" && (
          <Form.Item
            label="Lý do từ chối"
            name="rejectionNote"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lý do từ chối",
              },
            ]}
          >
            <TextArea rows={2} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default RegisterForm;
