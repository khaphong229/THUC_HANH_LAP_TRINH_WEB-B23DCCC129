import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, Card } from "antd";
import { Room } from "@/services/RoomManagement/typing";

const { Option } = Select;

interface RoomFormProps {
  room?: Room;
  onSave: (room: Room) => void;
}

const fakeManagers = [
  "Nguyễn Văn A",
  "Trần Thị B",
  "Lê Văn C",
  "Hoàng Thị D",
  "Phạm Văn E",
  "Vũ Thị F",
  "Đặng Văn G",
  "Bùi Thị H",
  "Ngô Văn I",
  "Đỗ Thị J",
];

const RoomForm: React.FC<RoomFormProps> = ({ room, onSave }) => {
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
  }, []);

  useEffect(() => {
    if (room) {
      form.setFieldsValue(room);
    } else {
      form.resetFields();
    }
  }, [room]);

  const handleFinish = (values: Room) => {
    const updatedRooms = room
      ? rooms.map((r) => (r.room_id === values.room_id ? values : r))
      : [...rooms, values];

    setRooms(updatedRooms);
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    onSave(values);
    form.resetFields();
  };

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="room_id"
          label="Mã phòng"
          rules={[
            { required: true, message: "Vui lòng nhập mã phòng" },
            { max: 10, message: "Không nhập quá 10 ký tự" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên phòng"
          rules={[
            { required: true, message: "Vui lòng nhập tên" },
            { max: 50, message: "Không nhập quá 50 ký tự" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="seats"
          label="Số chỗ ngồi"
          rules={[{ required: true, message: "Vui lòng nhập số chỗ ngồi" }]}
        >
          <InputNumber min={10} max={200} />
        </Form.Item>

        <Form.Item
          name="type"
          label="Loại phòng"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select>
            <Option value="theory">Lý thuyết</Option>
            <Option value="practice">Thực hành</Option>
            <Option value="auditorium">Hội trường</Option>
          </Select>
        </Form.Item>

        <Form.Item name="manager" label="Người phụ trách">
          <Select style={{ width: "100%" }} placeholder="Chọn người phụ trách" allowClear>
            {fakeManagers.map((manager) => (
              <Option key={manager} value={manager}>
                {manager}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">{room ? "Cập nhật" : "Thêm mới"}</Button>
      </Form>
    </Card>
  );
};

export default RoomForm;
