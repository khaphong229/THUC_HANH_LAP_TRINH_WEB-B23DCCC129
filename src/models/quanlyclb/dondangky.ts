import { RegisterService } from '@/services/DonDangKy/api';
import type { Register } from '@/services/DonDangKy/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const [registers, setRegisters] = useState<Register[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [selectedRegister, setSelectedRegister] = useState<Register | null>(null);
	const [detailVisible, setDetailVisible] = useState<boolean>(false);
	const [detailRecord, setDetailRecord] = useState<Register | null>(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [selectedRows, setSelectedRows] = useState<Register[]>([]);

	const fetchRegisters = async () => {
		try {
			setLoading(true);
			const data = await RegisterService.getAllRegisters();
			setRegisters(data);
		} catch (error) {
			message.error('Không thể tải danh sách đăng ký');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (record: Register) => {
		setSelectedRegister(record);
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setSelectedRegister(null);
	};

	const handleDelete = async (record: Register) => {
		try {
			await RegisterService.deleteRegister(record.id.toString());
			message.success('Xóa thành công');
			fetchRegisters();
		} catch (error) {
			message.error('Xóa thất bại');
			console.error(error);
		}
	};

	const handleView = (record: Register) => {
		setDetailRecord(record);
		setDetailVisible(true);
	};

	const handleSave = async (values: Register) => {
		try {
			if (values.id) {
				await RegisterService.updateRegister(values.id.toString(), values);
				message.success('Cập nhật thành công');
			} else {
				await RegisterService.createRegister(values);
				message.success('Thêm mới thành công');
			}
			fetchRegisters();
			setIsModalVisible(false);
			setSelectedRegister(null);
		} catch (error) {
			message.error('Lưu thất bại');
			console.error(error);
		}
	};

	return {
		registers,
		setRegisters,
		loading,
		setLoading,
		isModalVisible,
		setIsModalVisible,
		selectedRegister,
		setSelectedRegister,
		detailVisible,
		setDetailVisible,
		detailRecord,
		setDetailRecord,
		selectedRowKeys,
		setSelectedRowKeys,
		selectedRows,
		setSelectedRows,
		handleEdit,
		handleCancel,
		handleDelete,
		handleView,
		handleSave,
		fetchRegisters,
	};
};
