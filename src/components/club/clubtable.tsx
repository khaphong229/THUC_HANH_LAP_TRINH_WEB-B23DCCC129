// src/components/club/ClubTable.tsx
import React, { useState } from 'react';
import { Table, Space, Button, Popconfirm, Input, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined, SearchOutlined } from '@ant-design/icons';
import { Club, ClubTableParams } from '../../models/club';
import moment from 'moment';
import ImageDisplay from '../common/imagedisplay'; // Import component hiển thị ảnh

interface ClubTableProps {
  dataSource: Club[];
  loading: boolean;
  total: number;
  onEdit: (record: Club) => void;
  onDelete: (id: number) => void;
  onViewMembers: (clubId: number) => void;
  onTableChange: (params: ClubTableParams) => void;
  tableParams: ClubTableParams;
}

const ClubTable: React.FC<ClubTableProps> = ({
  dataSource,
  loading,
  total,
  onEdit,
  onDelete,
  onViewMembers,
  onTableChange,
  tableParams,
}) => {
  const [searchText, setSearchText] = useState<string>('');

  const handleSearch = () => {
    const newParams = {
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1, // Reset về trang đầu tiên khi tìm kiếm
      },
      search: searchText,
    };
    onTableChange(newParams);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newParams: ClubTableParams = {
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total,
      },
      filters,
      sorter: sorter.field && sorter.order
        ? { field: sorter.field, order: sorter.order }
        : undefined,
      search: tableParams.search,
    };
    onTableChange(newParams);
  };

  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string, record: Club) => (
        <ImageDisplay
          src={avatar}
          alt={record.name}
          size={64}
          shape="square"
        />
      ),
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: tableParams.sorter?.field === 'name' ? tableParams.sorter.order : null,
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      key: 'foundedDate',
      sorter: true,
      sortOrder: tableParams.sorter?.field === 'foundedDate' ? tableParams.sorter.order : null,
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (html: string) => (
        <div 
          style={{ maxWidth: 300, maxHeight: 100, overflow: 'auto' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ),
    },
    {
      title: 'Chủ nhiệm CLB',
      dataIndex: 'leader',
      key: 'leader',
      sorter: true,
      sortOrder: tableParams.sorter?.field === 'leader' ? tableParams.sorter.order : null,
    },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      key: 'active',
      filters: [
        { text: 'Đang hoạt động', value: true },
        { text: 'Ngừng hoạt động', value: false },
      ],
      filteredValue: tableParams.filters?.active || null,
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Club) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            type="link"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa câu lạc bộ này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            icon={<TeamOutlined />}
            onClick={() => onViewMembers(record.id)}
            type="link"
          >
            Xem thành viên
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex' }}>
        <Input
          placeholder="Tìm kiếm câu lạc bộ"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 300, marginRight: 16 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
      
      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        pagination={{
          current: tableParams.pagination.current,
          pageSize: tableParams.pagination.pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng: ${total} câu lạc bộ`,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default ClubTable;