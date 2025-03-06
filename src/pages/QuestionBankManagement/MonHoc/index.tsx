import { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './SubjectList.less';
import SubjectForm from './components/SubjectForm';
import { subjectService } from '@/services/MonHoc/api';

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

	const fetchSubjects = async () => {
		setLoading(true);
		try {
			const data = await subjectService.getAllSubjects();
			setSubjects(data);
		} catch (error) {
			console.error('Lỗi khi tải danh sách môn học:', error);
			message.error('Không thể tải danh sách môn học');
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setEditingId(null);
		setCurrentSubject(undefined);
		setIsModalVisible(false);
	};

	const handleSubmit = async (formData: Subject) => {
		setLoading(true);
		try {
			if (editingId) {
				await subjectService.updateSubject(editingId, formData);
				message.success('Cập nhật môn học thành công');
			} else {
				await subjectService.createSubject(formData);
				message.success('Thêm môn học thành công');
			}
			fetchSubjects();
			resetForm();
		} catch (error) {
			console.error('Lỗi khi lưu môn học:', error);
			message.error('Không thể lưu môn học');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = (id: string) => {
		Modal.confirm({
			title: 'Xác nhận xóa môn học',
			content: 'Bạn có chắc chắn muốn xóa môn học này không?',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: async () => {
				setLoading(true);
				try {
					await subjectService.deleteSubject(id);
					message.success('Xóa môn học thành công');
					fetchSubjects();
				} catch (error) {
					console.error('Lỗi khi xóa môn học:', error);
					message.error('Không thể xóa môn học');
				} finally {
					setLoading(false);
				}
			},
		});
	};

	useEffect(() => {
		fetchSubjects();
	}, []);

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
			align: 'cetner' as 'center',
		},
		{
			title: 'Tên môn',
			dataIndex: 'name',
			key: 'name',
			sorter: (a: Subject, b: Subject) => a.name.localeCompare(b.name),
			align: 'cetner' as 'center',
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'credits',
			key: 'credits',
			sorter: (a: Subject, b: Subject) => a.credits - b.credits,
			align: 'cetner' as 'center',
		},
		{
			title: 'Hành động',
			key: 'action',
			align: 'cetner' as 'center',
			render: (_: any, record: Subject) => (
				<Space size='middle'>
					<Button type='primary' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id!)}>
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
				destroyOnClose
			>
				<SubjectForm initialData={currentSubject} onSubmit={handleSubmit} isEditing={!!editingId} />
			</Modal>
		</div>
	);
};

export default SubjectList;
