import React from 'react';
import { Table, Button } from 'antd';
import { Category, CategoryTableProps } from '@/services/KhoiKienThuc/typing';

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
	const columns = [
		{
			title: 'Mã khối kiến thức',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Tên khối kiến thức',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_: any, record: Category) => (
				<>
					<Button type='link' onClick={() => onEdit(record)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => onDelete(record.id)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	return <Table dataSource={categories} columns={columns} rowKey='id' pagination={false} />;
};

export default CategoryTable;
