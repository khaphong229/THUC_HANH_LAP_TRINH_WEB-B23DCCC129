// src/pages/Club/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ClubTable from '../../../components/club/clubtable';
import ClubForm from '../../../components/club/clubform';
import MemberList from '../../../components/club/memberlist';
import { Club, ClubFormValues, ClubTableParams } from '../../../models/club';
import { getClubs, createClub, updateClub, deleteClub } from '../../../services/QuanLyCauLacBo/DanhSach/club';

const ClubManagement: React.FC = () => {
	const [clubs, setClubs] = useState<Club[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [selectedClub, setSelectedClub] = useState<Club | undefined>(undefined);
	const [formLoading, setFormLoading] = useState<boolean>(false);
	const [viewingMembers, setViewingMembers] = useState<boolean>(false);
	const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
	const [tableParams, setTableParams] = useState<ClubTableParams>({
		pagination: {
			current: 1,
			pageSize: 10,
		},
	});

	const fetchClubs = async (params: ClubTableParams) => {
		setLoading(true);
		try {
			const { data, total } = await getClubs(params);
			setClubs(data);
			setTableParams({
				...params,
				pagination: {
					...params.pagination,
					total,
				},
			});
		} catch (error) {
			message.error('Không thể tải danh sách câu lạc bộ');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchClubs(tableParams);
	}, []);

	const handleAddClub = () => {
		setSelectedClub(undefined);
		setModalVisible(true);
	};

	const handleEditClub = (club: Club) => {
		setSelectedClub(club);
		setModalVisible(true);
	};

	const handleDeleteClub = async (id: number) => {
		try {
			await deleteClub(id);
			message.success('Xóa câu lạc bộ thành công');
			fetchClubs(tableParams);
		} catch (error) {
			message.error('Không thể xóa câu lạc bộ');
		}
	};

	const handleFormFinish = async (values: ClubFormValues) => {
		setFormLoading(true);
		try {
			if (values.id) {
				await updateClub(values.id, values);
				message.success('Cập nhật câu lạc bộ thành công');
			} else {
				await createClub(values);
				message.success('Thêm mới câu lạc bộ thành công');
			}
			setModalVisible(false);
			fetchClubs(tableParams);
		} catch (error) {
			message.error('Có lỗi xảy ra khi lưu câu lạc bộ');
		} finally {
			setFormLoading(false);
		}
	};

	const handleTableChange = (params: ClubTableParams) => {
		setTableParams(params);
		fetchClubs(params);
	};

	const handleViewMembers = (clubId: number) => {
		setSelectedClubId(clubId);
		setViewingMembers(true);
	};

	const handleBackToClubList = () => {
		setViewingMembers(false);
		setSelectedClubId(null);
	};

	return (
		<div style={{ padding: '24px' }}>
			{!viewingMembers ? (
				<Card
					title="Danh sách câu lạc bộ"
					extra={
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={handleAddClub}
						>
							Thêm mới
						</Button>
					}
				>
					<ClubTable
						dataSource={clubs}
						loading={loading}
						total={tableParams.pagination.total || 0}
						onEdit={handleEditClub}
						onDelete={handleDeleteClub}
						onViewMembers={handleViewMembers}
						onTableChange={handleTableChange}
						tableParams={tableParams}
					/>
				</Card>
			) : (
				selectedClubId && <MemberList clubId={selectedClubId} onBack={handleBackToClubList} />
			)}

			<Modal
				title={selectedClub ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
				visible={modalVisible} 
				onCancel={() => setModalVisible(false)}
				footer={null}
				width={800}
				destroyOnClose
			>

				<ClubForm
					initialValues={selectedClub}
					onFinish={handleFormFinish}
					onCancel={() => setModalVisible(false)}
					loading={formLoading}
				/>
			</Modal>
		</div>
	);
};

export default ClubManagement;