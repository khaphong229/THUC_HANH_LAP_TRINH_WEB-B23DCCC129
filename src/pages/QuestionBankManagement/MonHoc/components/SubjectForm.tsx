import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import '../SubjectList.less';
interface Subject {
	_id?: string;
	code: string;
	name: string;
	credits: number;
}

interface SubjectFormProps {
	initialData?: Subject;
	onSubmit: (formData: Subject) => void;
	isEditing: boolean;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ initialData, onSubmit, isEditing }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (initialData) {
			form.setFieldsValue(initialData);
		} else {
			form.resetFields();
		}
	}, [initialData, form]);

	const handleFinish = (values: Subject) => {
		// Preserve the _id if we're editing
		if (isEditing && initialData?._id) {
			values._id = initialData._id;
		}
		onSubmit(values);
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleFinish} initialValues={{ code: '', name: '', credits: 0 }}>
			<Form.Item name='code' label='Mã môn' rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}>
				<Input placeholder='Nhập mã môn học' />
			</Form.Item>

			<Form.Item name='name' label='Tên môn' rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}>
				<Input placeholder='Nhập tên môn học' />
			</Form.Item>

			<Form.Item name='credits' label='Số tín chỉ' rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}>
				<InputNumber min={1} max={10} placeholder='Nhập số tín chỉ' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item>
				<Button type='primary' htmlType='submit' block>
					{isEditing ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</Form.Item>
		</Form>
	);
};

export default SubjectForm;
