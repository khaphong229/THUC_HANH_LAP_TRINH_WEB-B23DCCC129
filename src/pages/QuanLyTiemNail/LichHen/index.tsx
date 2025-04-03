import React,{useState,useEffect} from 'react';
import { Appointment, Statuss } from '@/services/Appointment/typing';
import { appointService } from '@/services/Appointment/api';
import { message } from 'antd';
import {Table,Button, Input, Select, Space, Modal, Row, Col} from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';

import AppointmentForm from './components/AppointmentForm';


const AppointmentList: React.FC =() =>{
	const [qppointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
	const [customer,setCustomer] = useState<string[]>([]);

	// lấy danh sách lịch hẹn
	const fetchAppointments = async () =>{
		try{
			setLoading(true);
			const data = await appointService.getAllAppointment();
			setAppointments(data);
		} catch(error){
			message.error("không thể lấy danh sách lịch hẹn");
			console.error(error)
		} finally{
			setLoading(false);
		}
	}

	// Mở modal form để thêm/sửa câu hỏi
		const showModal = (question: Appointment | null = null) => {
			console.log(question);
			
			setCurrentAppointment(question);
			setIsModalVisible(true);
		};
	
		// Xử lý khi lưu form
		const handleSave = async (values: Omit<Appointment, 'id'>) => {
			try {
				if (currentAppointment) {
					console.log(currentAppointment);
					
					// Cập nhật câu hỏi
					await appointService.updateAppointment(currentAppointment.id, values);
					message.success('Cập nhật câu hỏi thành công!');
				} else {
					// Thêm câu hỏi mới
					await appointService.createAppointment(values);
					message.success('Thêm câu hỏi thành công!');
				}
				setIsModalVisible(false);
				fetchAppointments();
			} catch (error) {
				message.error('Không thể lưu câu hỏi!');
				console.error(error);
			}
		};
	
			// Xóa câu hỏi
			const handleDelete = async (id: string) => {
				Modal.confirm({
					title: 'Xác nhận xóa',
					content: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
					onOk: async () => {
						try {
							await appointService.deleteAppointment(id);
							message.success('Xóa câu hỏi thành công!');
							fetchAppointments();
						} catch (error) {
							message.error('Không thể xóa câu hỏi!');
							console.error(error);
						}
					},
				});
			};
		

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
		<div className="appointment">
			<h1>Danh sách lịch hẹn</h1>
			<Button type='primary' icon={<PlusOutlined />} onClick={() => showModal()} className='add-button'>
						Thêm câu hỏi
					</Button>
			<Table
				columns={columns}
				dataSource={qppointments}
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
		

	)
	

}

export default AppointmentList;