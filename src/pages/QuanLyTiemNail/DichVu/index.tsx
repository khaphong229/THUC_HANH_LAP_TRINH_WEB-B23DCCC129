import React, { useEffect } from 'react';
import { Form, Space } from 'antd';
import useDichVu from '@/models/dichvu';
import ServiceForm from '@/components/DichVu/ServiceForm';
import ServiceList from '@/components/DichVu/ServiceList';

export default function ServiceManagement() {
	const [form] = Form.useForm();
	const {
		services,
		employees,
		loading,
		editId,
		fetchServices,
		fetchEmployees,
		addService,
		updateService,
		deleteService,
		handleEdit: editService,
		resetForm,
		getEmployeeName,
	} = useDichVu();

	useEffect(() => {
		fetchServices();
		fetchEmployees();
	}, []);

	const handleFinish = async (values: any) => {
		let success;
		if (editId) {
			success = await updateService(values);
		} else {
			success = await addService(values);
		}

		if (success) {
			form.resetFields();
			resetForm();
		}
	};

	const handleEdit = (record: any) => {
		const formValues = editService(record);
		form.setFieldsValue(formValues);
	};

	const handleCancelEdit = () => {
		resetForm();
		form.resetFields();
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<ServiceForm
				form={form}
				loading={loading}
				editId={editId}
				employees={employees}
				onFinish={handleFinish}
				onCancelEdit={handleCancelEdit}
			/>

			<ServiceList
				services={services}
				loading={loading}
				getEmployeeName={getEmployeeName}
				onEdit={handleEdit}
				onDelete={deleteService}
			/>
		</Space>
	);
}
