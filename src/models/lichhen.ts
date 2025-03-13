import message from '@/locales/vi-VN/global/message';
import { appointService } from '@/services/Appointment/api';
import type { Appointment } from '@/services/Appointment/typing';
import { Modal } from 'antd';
import { useState } from 'react';

export default () => {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
	const [customer, setCustomer] = useState<string[]>([]);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			const data = await appointService.getAllAppointment();
			setAppointments(data);
		} catch (error) {
			message.error('không thể lấy danh sách lịch hẹn');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const showModal = (question: Appointment | null = null) => {
		console.log(question);

		setCurrentAppointment(question);
		setIsModalVisible(true);
	};

	const handleSave = async (values: Omit<Appointment, 'id'>) => {
		try {
			if (currentAppointment) {
				console.log(currentAppointment);

				await appointService.updateAppointment(currentAppointment.id, values);
				message.success('Cập nhật lịch hẹn thành công!');
			} else {
				await appointService.createAppointment(values);
				message.success('Thêm lịch hẹn thành công!');
			}
			setIsModalVisible(false);
			fetchAppointments();
		} catch (error) {
			message.error('Không thể lưu lịch hẹn!');
			console.error(error);
		}
	};

	const handleDelete = async (id: string) => {
		Modal.confirm({
			title: 'Xác nhận xóa',
			content: 'Bạn có chắc chắn muốn xóa lịch hẹn này không?',
			onOk: async () => {
				try {
					await appointService.deleteAppointment(id);
					message.success('Xóa lịch hẹn thành công!');
					fetchAppointments();
				} catch (error) {
					message.error('Không thể xóa lịch hẹn!');
					console.error(error);
				}
			},
		});
	};

	return {
		appointments,
		loading,
		isModalVisible,
		customer,
		setCustomer,
		fetchAppointments,
		showModal,
		handleSave,
		handleDelete,
		setIsModalVisible,
		currentAppointment,
	};
};
