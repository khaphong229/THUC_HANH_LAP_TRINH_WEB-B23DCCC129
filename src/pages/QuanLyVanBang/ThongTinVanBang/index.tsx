import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Space, Select, Typography, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { VanBang, BieuMau } from '@/models/sovanbangtypes';
import { useModel } from 'umi';

const { Title } = Typography;
const { Option } = Select;

const ThongTinVanBang: React.FC = () => {
	const {
		certificates,
		graduationBooks,
		graduationDecisions,
		templateFields,
		addCertificate,
		updateCertificate,
		deleteCertificate,
	} = useModel('sovanbangtypes');

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingCertificate, setEditingCertificate] = useState<VanBang.Certificate | null>(null);
	const [form] = Form.useForm();
	const [additionalFields, setAdditionalFields] = useState<Record<string, any>>({});

	const showAddModal = () => {
		setEditingCertificate(null);
		form.resetFields();
		setAdditionalFields({});
		setIsModalVisible(true);
	};

	const showEditModal = (certificate: VanBang.Certificate) => {
		setEditingCertificate(certificate);
		setAdditionalFields(certificate.additionalFields || {});
		form.setFieldsValue({
			...certificate,
			dateOfBirth: certificate.dateOfBirth ? moment(certificate.dateOfBirth) : null,
		});
		setIsModalVisible(true);
	};

	const handleOk = () => {
		form.validateFields().then(async (values) => {
			const certificateData: VanBang.Certificate = {
				...values,
				dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : '',
				additionalFields,
			};

			if (editingCertificate?.id) {
				await updateCertificate({ ...certificateData, id: editingCertificate.id });
			} else {
				await addCertificate(certificateData);
			}

			setIsModalVisible(false);
		});
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleAdditionalFieldChange = (fieldName: string, value: any) => {
		setAdditionalFields((prev) => ({ ...prev, [fieldName]: value }));
	};

	const renderAdditionalFieldInput = (field: BieuMau.CertificateTemplateField) => {
		const value = additionalFields[field.name] || '';

		switch (field.inputControl) {
			case 'text':
				return <Input value={value} onChange={(e) => handleAdditionalFieldChange(field.name, e.target.value)} />;
			case 'textarea':
				return (
					<Input.TextArea value={value} onChange={(e) => handleAdditionalFieldChange(field.name, e.target.value)} />
				);
			case 'number':
				return (
					<Input
						type='number'
						value={value}
						onChange={(e) => handleAdditionalFieldChange(field.name, parseFloat(e.target.value))}
					/>
				);
			case 'date':
				return (
					<DatePicker
						value={value ? moment(value) : null}
						onChange={(date) => handleAdditionalFieldChange(field.name, date ? date.format('YYYY-MM-DD') : null)}
						style={{ width: '100%' }}
					/>
				);
			default:
				return <Input value={value} onChange={(e) => handleAdditionalFieldChange(field.name, e.target.value)} />;
		}
	};

	const columns: ColumnsType<VanBang.Certificate> = [
		{
			title: 'Mã SV',
			dataIndex: 'studentId',
			key: 'studentId',
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
			key: 'fullName',
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'dateOfBirth',
			key: 'dateOfBirth',
		},
		{
			title: 'Mã văn bằng',
			dataIndex: 'certificateNumber',
			key: 'certificateNumber',
		},
		{
			title: 'Số thứ tự',
			dataIndex: 'sequenceNumber',
			key: 'sequenceNumber',
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
						title='Bạn có chắc chắn muốn xóa thông tin này?'
						onConfirm={() => record.id && deleteCertificate(record.id)}
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
		<div className='certificate-container'>
			<div className='header-actions' style={{ marginBottom: 20 }}>
				<Title level={3}>Thông tin văn bằng</Title>
				<Button type='primary' icon={<PlusOutlined />} onClick={showAddModal}>
					Thêm thông tin
				</Button>
			</div>

			<Table columns={columns} dataSource={certificates} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={editingCertificate ? 'Sửa thông tin văn bằng' : 'Thêm thông tin văn bằng mới'}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				width={700}
			>
				<Form form={form} layout='vertical' name='certificateForm'>
					<Form.Item
						name='studentId'
						label='Mã sinh viên'
						rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item name='fullName' label='Họ và tên' rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
						<Input />
					</Form.Item>

					<Form.Item
						name='dateOfBirth'
						label='Ngày sinh'
						rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
					>
						<DatePicker format='YYYY-MM-DD' style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name='certificateNumber'
						label='Mã văn bằng'
						rules={[{ required: true, message: 'Vui lòng nhập mã văn bằng!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='sequenceNumber'
						label='Số thứ tự'
						rules={[{ required: true, message: 'Vui lòng nhập số thứ tự!' }]}
					>
						<Input type='number' />
					</Form.Item>

					<Form.Item
						name='graduationBookId'
						label='Sổ văn bằng'
						rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng!' }]}
					>
						<Select placeholder='Chọn sổ văn bằng'>
							{graduationBooks.map((book) => (
								<Option key={book.id} value={book.id}>
									Sổ năm {book.year}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name='graduationDecisionId'
						label='Quyết định tốt nghiệp'
						rules={[{ required: true, message: 'Vui lòng chọn quyết định tốt nghiệp!' }]}
					>
						<Select placeholder='Chọn quyết định tốt nghiệp'>
							{graduationDecisions.map((decision) => (
								<Option key={decision.id} value={decision.id}>
									{decision.decisionNumber} - {decision.summary}
								</Option>
							))}
						</Select>
					</Form.Item>

					{templateFields.length > 0 && (
						<>
							<div className='additional-fields-title'>Thông tin bổ sung</div>
							{templateFields.map((field) => (
								<Form.Item key={field.id} label={field.name}>
									{renderAdditionalFieldInput(field)}
								</Form.Item>
							))}
						</>
					)}
				</Form>
			</Modal>

			<style>
				{`
        .additional-fields-title {
          font-weight: bold;
          margin-bottom: 16px;
          padding-top: 8px;
          border-top: 1px dashed #d9d9d9;
        }
        `}
			</style>
		</div>
	);
};

export default ThongTinVanBang;
