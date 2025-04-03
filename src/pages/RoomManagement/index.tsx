import React, { useState, useEffect } from "react";
import { Modal, Button, Select, Space, Input, message } from "antd";
import { Room, RoomType } from "@/services/RoomManagement/typing";
import RoomForm from "@/components/Room/RoomForm";
import RoomList from "@/components/Room/RoomList";

const { Option } = Select;

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(() =>
    JSON.parse(localStorage.getItem("rooms") || "[]")
  );
  const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // state loc
  const [selectedType, setSelectedType] = useState<RoomType | undefined>(undefined);
  const [selectedManager, setSelectedManager] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [managers, setManagers] = useState<string[]>([]);

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

  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  
    
    const uniqueManagers = Array.from(
      new Set([...fakeManagers, ...rooms.map((room) => room.manager).filter(Boolean)])
    );
  
    setManagers(uniqueManagers);
  }, [rooms]);

  const handleSave = (room: Room) => {

    const isDuplicate = rooms.some(
        (r) =>
          (r.room_id === room.room_id || r.name === room.name) &&
          r.room_id !== editingRoom?.room_id // Bỏ qua phòng đang chỉnh sửa
      );
    
      if (isDuplicate) {
        message.error("Mã phòng hoặc tên phòng đã tồn tại!");
        return;
      }

    const updatedRooms = editingRoom
      ? rooms.map((r) => (r.room_id === room.room_id ? room : r))
      : [...rooms, room];

    setRooms(updatedRooms);
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    setEditingRoom(undefined);
    setIsModalVisible(false);
    message.success(editingRoom ? "Cập nhật phòng thành công!" : "Thêm phòng mới thành công!");
  };
  const handleDelete = (id: string) => {
    const room = rooms.find((r) => r.room_id === id);
  
    if (!room) return;
  
    if (room.seats < 30) {
      message.warning(`Không thể xoá phòng "${room.name}" vì số chỗ ngồi dưới 30!`);
      return;
    }
  
    Modal.confirm({
      title: "Xác nhận xoá",
      content: `Bạn có chắc muốn xoá phòng học "${room.name}"?`,
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: () => {
        const filteredRooms = rooms.filter((r) => r.room_id !== id);
        setRooms(filteredRooms);
        localStorage.setItem("rooms", JSON.stringify(filteredRooms));
        message.success("Xoá phòng học thành công!");
      },
    });
  };
  

  // Lọc danh sách phòng
  const filteredRooms = rooms.filter((r) =>
    (!selectedType || r.type === selectedType) &&
    (!selectedManager || r.manager === selectedManager) &&
    (!searchTerm ||
      r.room_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsModalVisible(true);
  };

  return (
    <div>
         <Button type="primary" onClick={() => setIsModalVisible(true)} style={{marginBottom:10}} >
        Thêm phòng
      </Button> <br />
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo mã hoặc tên phòng"
          style={{ width: 200 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />

        <Select
          placeholder="Chọn loại phòng"
          allowClear
          style={{ width: 200 }}
          value={selectedType || undefined}
          onChange={(value) => setSelectedType(value)}
        >
          <Option value="theory">Lý thuyết</Option>
          <Option value="practice">Thực hành</Option>
          <Option value="auditorium">Hội trường</Option>
        </Select>

        <Select
          placeholder="Người phụ trách"
          allowClear
          style={{ width: 200 }}
          value={selectedManager || undefined}
          onChange={(value) => setSelectedManager(value)}
        >
          {managers.map((manager) => (
            <Option key={manager} value={manager}>
              {manager}
            </Option>
          ))}
        </Select>
      </Space>

     

      <Modal
        title={editingRoom ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <RoomForm room={editingRoom} onSave={handleSave} />
      </Modal>

      <RoomList rooms={filteredRooms} onDelete={handleDelete} onEdit={handleEdit} loading={false} />
    </div>
  );
};

export default RoomManagement;
