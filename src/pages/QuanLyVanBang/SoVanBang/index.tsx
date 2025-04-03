import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { VanBang } from '@/models/sovanbangtypes';
import { useModel } from 'umi';

const { Title } = Typography;

const SoVanBang: React.FC = () => {
	const { graduationBooks, addGraduationBook, updateGraduationBook } = useModel('sovanbangtypes');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingBook, setEditingBook] = useState<VanBang.GraduationBook | null>(null);
	const [form] = Form.useForm();

	const showAddModal = () => {
		setEditingBook(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const showEditModal = (book: VanBang.GraduationBook) => {
		setEditingBook(book);
		form.setFieldsValue(book);
		setIsModalVisible(true);
	};

	const handleOk = () => {
		form.validateFields().then(async (values) => {
			const bookData: VanBang.GraduationBook = {
				...values,
			};

			if (editingBook?.id) {
				await updateGraduationBook({ ...bookData, id: editingBook.id });
			} else {
				await addGraduationBook(bookData);
			}

			setIsModalVisible(false);
		});
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const columns: ColumnsType<VanBang.GraduationBook> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Năm',
			dataIndex: 'year',
			key: 'year',
			sorter: (a, b) => a.year - b.year,
		},
		{
			title: 'Số thứ tự hiện tại',
			dataIndex: 'currentSequenceNumber',
			key: 'currentSequenceNumber',
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space size='middle'>
					<Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
						Sửa
					</Button>
				</Space>
			),
		},
	];

	return (
		<div className='graduation-book-container'>
			<div className='header-actions' style={{ marginBottom: 20 }}>
				<Title level={3}>Danh sách sổ văn bằng</Title>
				<Button type='primary' icon={<PlusOutlined />} onClick={showAddModal}>
					Thêm sổ văn bằng mới
				</Button>
			</div>

			<Table columns={columns} dataSource={graduationBooks} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={editingBook ? 'Sửa thông tin sổ văn bằng' : 'Thêm sổ văn bằng mới'}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form form={form} layout='vertical' name='graduationBookForm'>
					<Form.Item name='year' label='Năm' rules={[{ required: true, message: 'Vui lòng nhập năm!' }]}>
						<Input type='number' />
					</Form.Item>

					<Form.Item
						name='currentSequenceNumber'
						label='Số thứ tự hiện tại'
						rules={[{ required: true, message: 'Vui lòng nhập số thứ tự hiện tại!' }]}
					>
						<Input type='number' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default SoVanBang;
