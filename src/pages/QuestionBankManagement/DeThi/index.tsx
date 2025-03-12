import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';

const ExamManagement = () => {
	const [subject, setSubject] = useState('');
	const [questionCount, setQuestionCount] = useState({ easy: 0, medium: 0, hard: 0 });
	const [knowledgeBlock, setKnowledgeBlock] = useState('');
	const [examStructure, setExamStructure] = useState(null);
	const [error, setError] = useState('');

	const handleCreateExam = () => {
		if (questionCount.easy + questionCount.medium + questionCount.hard === 0) {
			setError('Vui lòng nhập số lượng câu hỏi.');
			return;
		}
		setExamStructure({ subject, questionCount, knowledgeBlock });
		message.success('Đề thi đã được tạo thành công!');
	};

	const handleSaveStructure = () => {
		message.success('Cấu trúc đề thi đã được lưu!');
	};

	const handleStoreExam = () => {
		message.success('Đề thi đã được lưu trữ!');
	};

	return (
		<>
			<h2>Quản lý ngân hàng đề thi</h2>
			<Form onFinish={handleCreateExam}>
				<Form.Item label='Môn học'>
					<Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder='Nhập môn học' />
				</Form.Item>
				<Form.Item label='Số lượng câu hỏi dễ'>
					<Input
						type='number'
						value={questionCount.easy}
						onChange={(e) => setQuestionCount({ ...questionCount, easy: +e.target.value })}
					/>
				</Form.Item>
				<Form.Item label='Số lượng câu hỏi trung bình'>
					<Input
						type='number'
						value={questionCount.medium}
						onChange={(e) => setQuestionCount({ ...questionCount, medium: +e.target.value })}
					/>
				</Form.Item>
				<Form.Item label='Số lượng câu hỏi khó'>
					<Input
						type='number'
						value={questionCount.hard}
						onChange={(e) => setQuestionCount({ ...questionCount, hard: +e.target.value })}
					/>
				</Form.Item>
				<Form.Item label='Khối kiến thức'>
					<Input
						value={knowledgeBlock}
						onChange={(e) => setKnowledgeBlock(e.target.value)}
						placeholder='Nhập khối kiến thức'
					/>
				</Form.Item>
				<Form.Item>
					<Button type='primary' htmlType='submit'>
						Tạo Đề Thi
					</Button>
					<Button type='default' onClick={handleSaveStructure} style={{ marginLeft: '10px' }}>
						Lưu Cấu Trúc
					</Button>
					<Button type='default' onClick={handleStoreExam} style={{ marginLeft: '10px' }}>
						Lưu Đề Thi
					</Button>
				</Form.Item>
			</Form>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</>
	);
};

export default ExamManagement;
