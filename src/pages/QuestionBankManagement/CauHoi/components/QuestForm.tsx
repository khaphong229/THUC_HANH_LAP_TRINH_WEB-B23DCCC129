// components/QuestionForm.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { Question, DifficultyLevel, QuestionFormProps, KnowledgeBlock, Subject } from '@/services/CauHoi/typing';
import axios from 'axios';
// import './QuestionForm.less';

const { Option } = Select;
const { TextArea } = Input;

const QuestionForm: React.FC<QuestionFormProps> = ({ visible, onCancel, onSave, initialValues }) => {
	const [form] = Form.useForm();
	const [knowledgeBlocks, setKnowledgeBlocks] = useState<KnowledgeBlock[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	// Hàm lấy danh sách khối kiến thức từ API
	const fetchKnowledgeBlocks = async () => {
		try {
			setLoading(true);
			const response = await axios.get('https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/categories');
			setKnowledgeBlocks(response.data);
		} catch (error) {
			console.error('Không thể tải danh sách khối kiến thức:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchSubject = async () => {
		try {
			setLoading(true);
			const response = await axios.get('https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/subjects');
			setSubjects(response.data);
		} catch (error) {
			console.error('Không thể tải danh sách khối kiến thức:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (visible) {
			form.resetFields();
			if (initialValues) {
				form.setFieldsValue(initialValues);
			}
			// Gọi API lấy khối kiến thức khi form được mở
			fetchKnowledgeBlocks();
			fetchSubject();
		}
	}, [visible, initialValues, form]);

	const handleSubmit = () => {
		form
			.validateFields()
			.then((values) => {
				onSave(values);
				form.resetFields();
			})
			.catch((info) => {
				console.log('Validate Failed:', info);
			});
	};

	return (
		<Modal
			title={initialValues ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
			visible={visible}
			onCancel={onCancel}
			footer={[
				<Button key='back' onClick={onCancel}>
					Hủy
				</Button>,
				<Button key='submit' type='primary' onClick={handleSubmit}>
					Lưu
				</Button>,
			]}
			width={700}
		>
			<Form form={form} layout='vertical' name='questionForm' initialValues={initialValues || {}}>
				{/* Môn học  */}
				<Form.Item name='subject' label='Môn học' rules={[{ required: true, message: 'Vui lòng nhập môn học!' }]}>
					<Select
						placeholder='Chọn môn học'
						showSearch
						filterOption={(input, option) =>
							(option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
					>
						{subjects.map((subject) => (
							<Option key={subject.id} value={subject.name}>
								{subject.name}
							</Option>
						))}
					</Select>
				</Form.Item>

				{/* Nội dung câu hỏi */}
				<Form.Item
					name='content'
					label='Nội dung câu hỏi'
					rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
				>
					<TextArea rows={6} placeholder='Nhập nội dung câu hỏi...' />
				</Form.Item>

				{/* Mức độ khó */}
				<Form.Item
					name='difficultyLevel'
					label='Mức độ khó'
					rules={[{ required: true, message: 'Vui lòng chọn mức độ khó!' }]}
				>
					<Select placeholder='Chọn mức độ khó'>
						{Object.values(DifficultyLevel).map((level) => (
							<Option key={level} value={level}>
								{level}
							</Option>
						))}
					</Select>
				</Form.Item>

				{/* Khối kiến thức  */}
				<Form.Item
					name='knowledgeBlock'
					label='Khối kiến thức'
					rules={[{ required: true, message: 'Vui lòng nhập khối kiến thức!' }]}
				>
					<Select
						placeholder='Chọn khối kiến thức'
						showSearch
						loading={loading}
						filterOption={(input, option) =>
							(option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
						dropdownRender={(menu) => (
							<>
								{menu}
								<div className='dropdown-divider' />
							</>
						)}
					>
						{knowledgeBlocks.map((block) => (
							<Option key={block.id} value={block.name}>
								{block.name}
							</Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default QuestionForm;
