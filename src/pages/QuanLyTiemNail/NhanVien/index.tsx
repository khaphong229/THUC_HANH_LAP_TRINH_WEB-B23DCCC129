import React, { useEffect } from 'react';
import { Form, Space } from 'antd';
import useNhanVien from '@/models/nhanvien';
import EmployeeForm from '@/components/NhanVien/EmployeeForm';
import EmployeeList from '@/components/NhanVien/EmployeeList';

export default function EmployeeManagement() {
	const [form] = Form.useForm();
	const {
		employees,
		loading,
		editId,
		selectedDays,
		fetchEmployees,
		addEmployee,
		updateEmployee,
		deleteEmployee,
		handleEdit: editEmployee,
		resetForm,
		setWorkDays,
	} = useNhanVien();

	useEffect(() => {
		fetchEmployees();
	}, []);

	const handleFinish = async (values: any) => {
		let success;
		if (editId) {
			success = await updateEmployee(values);
		} else {
			success = await addEmployee(values);
		}

		if (success) {
			form.resetFields();
			resetForm();
		}
	};

	const handleEdit = (record: any) => {
		const formValues = editEmployee(record);
		form.setFieldsValue(formValues);
	};

	const handleCancelEdit = () => {
		resetForm();
		form.resetFields();
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<EmployeeForm
				form={form}
				loading={loading}
				editId={editId}
				selectedDays={selectedDays}
				onFinish={handleFinish}
				onDaysChange={setWorkDays}
				onCancelEdit={handleCancelEdit}
			/>

			<EmployeeList employees={employees} loading={loading} onEdit={handleEdit} onDelete={deleteEmployee} />
		</Space>
	);
}
