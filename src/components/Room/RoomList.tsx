import React from "react";
import { Room, RoomType } from "@/services/RoomManagement/typing";
import { Table, Button, Popconfirm, Space, Card, Typography,Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface RoomListProps {
  rooms: Room[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (room: Room) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Mã phòng",
      dataIndex: "room_id",
      key: "room_id",
      width: 100,
      align: "center" as "center",
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
      width: 260,
    align: "center" as "center",

    },
    {
      title: "Số ghế ngồi",
      dataIndex: "seats",
      key: "seats",
      width: 150,
      sorter: (a: Room, b: Room) => (b.seats || 0) - (a.seats || 0),
      defaultSortOrder: "descend" as const,
      render: (seats?: number) => (seats ? seats.toLocaleString() : "N/A"),
    align: "center" as "center",

    },
    {
      title: "Loại phòng",
      dataIndex: "type",
      key: "type",
      width: 200,
      align: "center" as "center",
      render: (type: RoomType) => {
        switch (type) {
          case RoomType.Theory:
            return <Tag color="blue">Lý thuyết</Tag>;
          case RoomType.Practice:
            return <Tag color="green">Thực hành</Tag>;
          case RoomType.Auditorium:
            return <Tag color="purple">Hội trường</Tag>;
          default:
            return <Tag color="default">Không xác định</Tag>;
        }}
    },
    {
      title: "Hành Động",
      key: "actions",
        align: "center" as "center",

      render: (record: Room) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => onDelete(record.room_id)}
            okText="Xóa"
            cancelText="Hủy"
          >
               <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>Danh sách phòng học</Title>
      <Table
        columns={columns}
        dataSource={rooms}
        rowKey="room_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 80 }}
      />
    </Card>
  );
};

export default RoomList;
