import React, { useEffect } from 'react';
import type { Appointment } from '@/services/Appointment/typing';
import { Statuss } from '@/services/Appointment/typing';
import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useLichHen from '@/models/lichhen';
import AppointmentForm from './components/AppointmentForm';

const AppointmentList: React.FC = () => {
	const {
		appointments,
		loading,
		isModalVisible,
		customer,
		fetchAppointments,
		showModal,
		handleSave,
		handleDelete,
		setIsModalVisible,
		currentAppointment,
	} = useLichHen();

	useEffect(() => {
		fetchAppointments();
	}, []);

	const columns = [
		{
			title: 'Mã lịch hẹn',
			dataIndex: 'id',
			key: 'id',
			width: 50,
			align: 'center' as 'center',
		},
		{
			title: 'Tên nhân viên',
			dataIndex: 'customer',
			key: 'customer',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: 'Ngày',
			dataIndex: 'day',
			key: 'day',
			width: 10,
			align: 'center' as 'center',

			ellipsis: true,
			render: (text: string) => (
				<div style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '60px', overflow: 'hidden' }}>
					{text}
				</div>
			),
		},
		{
			title: 'Giờ',
			dataIndex: 'hour',
			key: 'hour',
			width: 10,
			align: 'center' as 'center',

			ellipsis: true,
			render: (text: string) => (
				<div style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '60px', overflow: 'hidden' }}>
					{text}
				</div>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 70,
			align: 'center' as 'center',

			render: (text: Statuss) => {
				const colors = {
					[Statuss.PENDING]: 'green',
					[Statuss.APPROVED]: 'blue',
					[Statuss.COMPLETED]: 'orange',
					[Statuss.CANCELED]: 'red',
				};
				return <span className={`difficulty-tag ${colors[text]}`}>{text}</span>;
			},
		},

		{
			title: 'Thao tác',
			key: 'action',
			width: 100,
			align: 'center' as 'center',

			render: (_: any, record: Appointment) => (
				<Space size='small'>
					<Button type='primary' icon={<EditOutlined />} size='small' onClick={() => showModal(record)} />
					<Button danger icon={<DeleteOutlined />} size='small' onClick={() => handleDelete(record.id)} />
				</Space>
			),
		},
	];

	return (
		<div className='appointment'>
			<h1>Danh sách lịch hẹn</h1>
			<Button type='primary' icon={<PlusOutlined />} onClick={() => showModal()} className='add-button'>
				Thêm lịch hẹn
			</Button>
			<Table
				columns={columns}
				dataSource={appointments}
				rowKey='id'
				loading={loading}
				pagination={{ pageSize: 10 }}
				scroll={{ x: 'max-content' }}
				style={{ marginTop: '16px' }}
			/>
			<AppointmentForm
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onSave={handleSave}
				initialValues={currentAppointment}
				subjects={customer}
			/>
		</div>
	);
};

export default AppointmentList;
