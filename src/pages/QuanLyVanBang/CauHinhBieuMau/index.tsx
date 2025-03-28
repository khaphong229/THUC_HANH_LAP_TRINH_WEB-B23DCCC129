import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { BieuMau } from '@/models/sovanbangtypes';
import { useModel } from 'umi';

const { Title } = Typography;
const { Option } = Select;

const CauHinhBieuMau: React.FC = () => {
	const { templateFields, addTemplateField, updateTemplateField, deleteTemplateField } = useModel('sovanbangtypes');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingField, setEditingField] = useState<BieuMau.CertificateTemplateField | null>(null);
	const [form] = Form.useForm();

	const showAddModal = () => {
		setEditingField(null);
		form.resetFields();
		form.setFieldsValue({
			dataType: 'String',
			inputControl: 'text',
		});
		setIsModalVisible(true);
	};

	const showEditModal = (field: BieuMau.CertificateTemplateField) => {
		setEditingField(field);
		form.setFieldsValue(field);
		setIsModalVisible(true);
	};

	const handleOk = () => {
		form.validateFields().then(async (values) => {
			const fieldData: BieuMau.CertificateTemplateField = {
				...values,
			};

			if (editingField?.id) {
				await updateTemplateField({ ...fieldData, id: editingField.id });
			} else {
				await addTemplateField(fieldData);
			}

			setIsModalVisible(false);
		});
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleDelete = async (id: string) => {
		await deleteTemplateField(id);
	};

	const columns: ColumnsType<BieuMau.CertificateTemplateField> = [
		{
			title: 'Tên trường',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Kiểu dữ liệu',
			dataIndex: 'dataType',
			key: 'dataType',
			render: (type) => {
				switch (type) {
					case 'String':
						return 'Chuỗi';
					case 'Number':
						return 'Số';
					case 'Date':
						return 'Ngày tháng';
					default:
						return type;
				}
			},
		},
		{
			title: 'Điều khiển nhập liệu',
			dataIndex: 'inputControl',
			key: 'inputControl',
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space size='middle'>
					<Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa trường này?'
						onConfirm={() => record.id && handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button icon={<DeleteOutlined />} danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='template-field-container'>
			<div className='header-actions' style={{ marginBottom: 20 }}>
				<Title level={3}>Cấu hình biểu mẫu văn bằng</Title>
				<Button type='primary' icon={<PlusOutlined />} onClick={showAddModal}>
					Thêm cấu hình mới
				</Button>
			</div>

			<Table columns={columns} dataSource={templateFields} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={editingField ? 'Sửa cấu hình biểu mẫu' : 'Thêm cấu hình biểu mẫu mới'}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				width={600}
			>
				<Form form={form} layout='vertical' name='templateFieldForm'>
					<Form.Item name='name' label='Tên trường' rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}>
						<Input />
					</Form.Item>

					<Form.Item
						name='dataType'
						label='Kiểu dữ liệu'
						rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu!' }]}
					>
						<Select>
							<Option value='String'>Chuỗi</Option>
							<Option value='Number'>Số</Option>
							<Option value='Date'>Ngày tháng</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name='inputControl'
						label='Điều khiển nhập liệu'
						rules={[{ required: true, message: 'Vui lòng chọn điều khiển nhập liệu!' }]}
					>
						<Select>
							<Option value='text'>Text</Option>
							<Option value='textarea'>TextArea</Option>
							<Option value='number'>Number</Option>
							<Option value='date'>Date</Option>
							<Option value='select'>Select</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default CauHinhBieuMau;
