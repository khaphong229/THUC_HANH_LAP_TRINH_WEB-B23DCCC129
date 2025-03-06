import { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './SubjectList.less';
import SubjectForm from './components/SubjectForm';

interface Subject {
	id?: string;
	code: string;
	name: string;
	credits: number;
}

const SubjectList = () => {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [currentSubject, setCurrentSubject] = useState<Subject | undefined>(undefined);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const fetchSubjects = () => {
		setLoading(true);
		fetch('https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/subjects')
			.then((res) => res.json())
			.then((data) => {
				setSubjects(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Lỗi khi tải danh sách môn học:', err);
				message.error('Không thể tải danh sách môn học');
				setLoading(false);
			});
	};

	const resetForm = () => {
		setEditingId(null);
		setCurrentSubject(undefined);
		setIsModalVisible(false);
	};

	const addSubject = (formData: Subject) => {
		setLoading(true);
		fetch('https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/subjects', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData),
		})
			.then((res) => {
				if (res.ok) {
					fetchSubjects();
					message.success('Thêm môn học thành công');
					resetForm();
				} else {
					throw new Error('Failed to add subject');
				}
			})
			.catch((err) => {
				console.error('Lỗi khi thêm môn học:', err);
				message.error('Không thể thêm môn học');
				setLoading(false);
			});
	};

	const updateSubject = (formData: Subject) => {
		setLoading(true);
		fetch(`https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/subjects/${editingId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData),
		})
			.then((res) => {
				if (res.ok) {
					fetchSubjects();
					message.success('Cập nhật môn học thành công');
					resetForm();
				} else {
					throw new Error('Failed to update subject');
				}
			})
			.catch((err) => {
				console.error('Lỗi khi cập nhật môn học:', err);
				message.error('Không thể cập nhật môn học');
				setLoading(false);
			});
	};
	const deleteSubject = (id: string) => {
		Modal.confirm({
			title: 'Xác nhận xóa môn học',
			content: 'Bạn có chắc chắn muốn xóa môn học này không?',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk() {
				setLoading(true);
				fetch(`https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/subjects/${id}`, {
					method: 'DELETE',
				})
					.then((res) => {
						if (res.ok) {
							fetchSubjects();
							message.success('Xóa môn học thành công');
						} else {
							throw new Error('Failed to delete subject');
						}
					})
					.catch((err) => {
						console.error('Lỗi khi xóa môn học:', err);
						message.error('Không thể xóa môn học');
						setLoading(false);
					});
			},
		});
	};

	useEffect(() => {
		fetchSubjects();
	}, []);

	const handleSubmit = (formData: Subject) => {
		if (editingId) {
			updateSubject(formData);
		} else {
			addSubject(formData);
		}
	};

	const handleAdd = () => {
		setEditingId(null);
		setCurrentSubject(undefined);
		setIsModalVisible(true);
	};

	const handleEdit = (subject: Subject) => {
		setEditingId(subject.id || null);
		setCurrentSubject(subject);
		setIsModalVisible(true);
	};

	const columns = [
		{
			title: 'Mã môn',
			dataIndex: 'code',
			key: 'code',
			sorter: (a: Subject, b: Subject) => a.code.localeCompare(b.code),
		},
		{
			title: 'Tên môn',
			dataIndex: 'name',
			key: 'name',
			sorter: (a: Subject, b: Subject) => a.name.localeCompare(b.name),
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'credits',
			key: 'credits',
			sorter: (a: Subject, b: Subject) => a.credits - b.credits,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: Subject) => (
				<Space size='middle'>
					<Button type='primary' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Button danger icon={<DeleteOutlined />} onClick={() => deleteSubject(record.id!)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<div className='subject-list-container'>
			<div className='subject-header'>
				<h2>Danh sách môn học</h2>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm môn học
				</Button>
			</div>

			<Table columns={columns} dataSource={subjects} rowKey='id' loading={loading} pagination={{ pageSize: 10 }} />

			<Modal
				title={editingId ? 'Cập nhật môn học' : 'Thêm môn học mới'}
				visible={isModalVisible}
				onCancel={resetForm}
				footer={null}
				destroyOnClose={true}
			>
				<SubjectForm initialData={currentSubject} onSubmit={handleSubmit} isEditing={!!editingId} />
			</Modal>
		</div>
	);
};

export default SubjectList;
