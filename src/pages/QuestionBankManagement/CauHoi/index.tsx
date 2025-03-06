import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Modal, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { questionService } from '@/services/CauHoi/api';
import QuestionForm from './components/QuestForm';
import { Question, DifficultyLevel } from '@/services/CauHoi/typing';
import './QuestList.less';

const { Option } = Select;

const QuestionList: React.FC = () => {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchParams, setSearchParams] = useState({
		subject: '',
		difficultyLevel: undefined as DifficultyLevel | undefined,
		knowledgeBlock: '',
	});
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
	const [subjects, setSubjects] = useState<string[]>([]);
	const [knowledgeBlocks, setKnowledgeBlocks] = useState<string[]>([]);

	// Lấy danh sách câu hỏi
	const fetchQuestions = async () => {
		try {
			setLoading(true);
			const data = await questionService.getAllQuestions();
			setQuestions(data);

			// Lấy danh sách môn học và khối kiến thức để dùng cho bộ lọc
			const uniqueSubjects = Array.from(new Set(data.map((q) => q.subject)));
			const uniqueKnowledgeBlocks = Array.from(new Set(data.map((q) => q.knowledgeBlock)));

			setSubjects(uniqueSubjects);
			setKnowledgeBlocks(uniqueKnowledgeBlocks);
		} catch (error) {
			message.error('Không thể tải danh sách câu hỏi!');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// Tìm kiếm câu hỏi
	const handleSearch = async () => {
		try {
			setLoading(true);
			const filteredParams = Object.fromEntries(
				Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined),
			);
			const data = await questionService.searchQuestions(filteredParams);
			setQuestions(data);
		} catch (error) {
			message.error('Lỗi khi tìm kiếm câu hỏi!');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// Xóa câu hỏi
	const handleDelete = async (id: string) => {
		Modal.confirm({
			title: 'Xác nhận xóa',
			content: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
			onOk: async () => {
				try {
					await questionService.deleteQuestion(id);
					message.success('Xóa câu hỏi thành công!');
					fetchQuestions();
				} catch (error) {
					message.error('Không thể xóa câu hỏi!');
					console.error(error);
				}
			},
		});
	};

	// Mở modal form để thêm/sửa câu hỏi
	const showModal = (question: Question | null = null) => {
		setCurrentQuestion(question);
		setIsModalVisible(true);
	};

	// Xử lý khi lưu form
	const handleSave = async (values: Omit<Question, 'id'>) => {
		try {
			if (currentQuestion) {
				// Cập nhật câu hỏi
				await questionService.updateQuestion(currentQuestion.id, values);
				message.success('Cập nhật câu hỏi thành công!');
			} else {
				// Thêm câu hỏi mới
				await questionService.createQuestion(values);
				message.success('Thêm câu hỏi thành công!');
			}
			setIsModalVisible(false);
			fetchQuestions();
		} catch (error) {
			message.error('Không thể lưu câu hỏi!');
			console.error(error);
		}
	};

	useEffect(() => {
		fetchQuestions();
	}, []);

	const columns = [
		{
			title: 'Mã câu hỏi',
			dataIndex: 'id',
			key: 'id',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: 'Môn học',
			dataIndex: 'subject',
			key: 'subject',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: 'Nội dung câu hỏi',
			dataIndex: 'content',
			key: 'content',
			width: '40%',
			align: 'center' as 'center',

			ellipsis: true,
			render: (text: string) => (
				<div style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '60px', overflow: 'hidden' }}>
					{text}
				</div>
			),
		},
		{
			title: 'Mức độ khó',
			dataIndex: 'difficultyLevel',
			key: 'difficultyLevel',
			width: 110,
			render: (text: DifficultyLevel) => {
				const colors = {
					[DifficultyLevel.EASY]: 'green',
					[DifficultyLevel.MEDIUM]: 'blue',
					[DifficultyLevel.HARD]: 'orange',
					[DifficultyLevel.VERY_HARD]: 'red',
				};
				return <span className={`difficulty-tag ${colors[text]}`}>{text}</span>;
			},
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'knowledgeBlock',
			key: 'knowledgeBlock',
			width: 150,
			ellipsis: true,
			align: 'center' as 'center', //
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 100,
			align: 'center' as 'center', //,

			render: (_: any, record: Question) => (
				<Space size='small'>
					<Button type='primary' icon={<EditOutlined />} size='small' onClick={() => showModal(record)} />
					<Button danger icon={<DeleteOutlined />} size='small' onClick={() => handleDelete(record.id)} />
				</Space>
			),
		},
	];

	return (
		<div className='question-management'>
			<h1>Quản lý câu hỏi tự luận</h1>

			<Row className='search-container' justify='space-between' align='middle' gutter={[16, 16]}>
				<Col>
					<Space size='middle' wrap>
						<Input
							placeholder='Tìm theo môn học'
							value={searchParams.subject}
							onChange={(e) => setSearchParams({ ...searchParams, subject: e.target.value })}
							style={{ width: 180 }}
						/>
						<Select
							placeholder='Mức độ khó'
							allowClear
							style={{ width: 130 }}
							value={searchParams.difficultyLevel}
							onChange={(value) => setSearchParams({ ...searchParams, difficultyLevel: value })}
						>
							{Object.values(DifficultyLevel).map((level) => (
								<Option key={level} value={level}>
									{level}
								</Option>
							))}
						</Select>
						<Input
							placeholder='Khối kiến thức'
							value={searchParams.knowledgeBlock}
							onChange={(e) => setSearchParams({ ...searchParams, knowledgeBlock: e.target.value })}
							style={{ width: 180 }}
						/>
						<Button type='primary' icon={<SearchOutlined />} onClick={handleSearch}>
							Tìm kiếm
						</Button>
					</Space>
				</Col>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => showModal()} className='add-button'>
						Thêm câu hỏi
					</Button>
				</Col>
			</Row>

			<Table
				columns={columns}
				dataSource={questions}
				rowKey='id'
				loading={loading}
				pagination={{ pageSize: 10 }}
				scroll={{ x: 'max-content' }}
				style={{ marginTop: '16px' }}
			/>

			<QuestionForm
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onSave={handleSave}
				initialValues={currentQuestion}
				subjects={subjects}
			/>
		</div>
	);
};

export default QuestionList;
