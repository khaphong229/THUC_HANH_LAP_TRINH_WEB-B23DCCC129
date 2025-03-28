import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Space, Typography, Popconfirm, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { QuyetDinh } from '@/models/sovanbangtypes';
import { useModel } from 'umi';

const { Title } = Typography;
const { TextArea } = Input;

const QuyetDinhTotNghiep: React.FC = () => {
	const { graduationDecisions, addGraduationDecision, updateGraduationDecision, deleteGraduationDecision } =
		useModel('sovanbangtypes');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingDecision, setEditingDecision] = useState<QuyetDinh.GraduationDecision | null>(null);
	const [form] = Form.useForm();

	const showAddModal = () => {
		setEditingDecision(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const showEditModal = (decision: QuyetDinh.GraduationDecision) => {
		setEditingDecision(decision);
		form.setFieldsValue({
			...decision,
			issuedDate: decision.issuedDate ? moment(decision.issuedDate) : null,
		});
		setIsModalVisible(true);
	};

	const handleOk = () => {
		form.validateFields().then(async (values) => {
			const decisionData: QuyetDinh.GraduationDecision = {
				...values,
				issuedDate: values.issuedDate ? values.issuedDate.format('YYYY-MM-DD') : '',
				totalLookups: values.totalLookups || 0,
			};

			if (editingDecision?.id) {
				await updateGraduationDecision({ ...decisionData, id: editingDecision.id });
			} else {
				await addGraduationDecision(decisionData);
			}

			setIsModalVisible(false);
		});
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleDelete = async (id: string) => {
		await deleteGraduationDecision(id);
	};

	const columns: ColumnsType<QuyetDinh.GraduationDecision> = [
		{
			title: 'Số quyết định',
			dataIndex: 'decisionNumber',
			key: 'decisionNumber',
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'issuedDate',
			key: 'issuedDate',
		},
		{
			title: 'Trích yếu',
			dataIndex: 'summary',
			key: 'summary',
			ellipsis: true,
		},
		{
			title: 'Sổ văn bằng',
			dataIndex: 'graduationBook',
			key: 'graduationBook',
		},
		{
			title: 'Lượt tra cứu',
			dataIndex: 'totalLookups',
			key: 'totalLookups',
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
						title='Bạn có chắc chắn muốn xóa quyết định này?'
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
		<div className='graduation-decision-container'>
			<div className='header-actions' style={{ marginBottom: 20 }}>
				<Title level={3}>Quản lý quyết định tốt nghiệp</Title>
				<Button type='primary' icon={<PlusOutlined />} onClick={showAddModal}>
					Thêm quyết định mới
				</Button>
			</div>

			<Table columns={columns} dataSource={graduationDecisions} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={editingDecision ? 'Sửa quyết định tốt nghiệp' : 'Thêm quyết định tốt nghiệp mới'}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				width={700}
			>
				<Form form={form} layout='vertical' name='graduationDecisionForm'>
					<Form.Item
						name='decisionNumber'
						label='Số quyết định'
						rules={[{ required: true, message: 'Vui lòng nhập số quyết định!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='issuedDate'
						label='Ngày ban hành'
						rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành!' }]}
					>
						<DatePicker format='YYYY-MM-DD' style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item name='summary' label='Trích yếu' rules={[{ required: true, message: 'Vui lòng nhập trích yếu!' }]}>
						<TextArea rows={4} />
					</Form.Item>

					<Form.Item
						name='graduationBook'
						label='Sổ văn bằng'
						rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng!' }]}
					>
						<Input />
					</Form.Item>

					{editingDecision && (
						<Form.Item name='totalLookups' label='Lượt tra cứu'>
							<InputNumber min={0} style={{ width: '100%' }} />
						</Form.Item>
					)}
				</Form>
			</Modal>
		</div>
	);
};

export default QuyetDinhTotNghiep;
