import React from 'react';
import { Table, Button } from 'antd';

interface Category {
	id: number;
	name: string;
}

interface CategoryTableProps {
	categories: Category[];
	onEdit: (category: Category) => void;
	onDelete: (id: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
	const columns = [
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
