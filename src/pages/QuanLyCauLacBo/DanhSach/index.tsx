import React, { useEffect } from 'react';
import { Card, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ClubTable from '../../../components/club/clubtable';
import ClubForm from '../../../components/club/clubform';
import MemberList from '../../../components/club/memberlist';
import type { ClubFormValues } from '../../../models/club';
import { createClub, updateClub } from '../../../services/QuanLyCauLacBo/DanhSach/club';
import { useModel } from 'umi';

const ClubManagement: React.FC = () => {
	const {
		clubs,
		setClubs,
		loading,
		setLoading,
		modalVisible,
		setModalVisible,
		selectedClub,
		setSelectedClub,
		formLoading,
		setFormLoading,
		viewingMembers,
		setViewingMembers,
		selectedClubId,
		setSelectedClubId,
		tableParams,
		setTableParams,
		fetchClubs,
		handleAddClub,
		handleEditClub,
		handleDeleteClub,
		handleTableChange,
		handleViewMembers,
		handleBackToClubList,
	} = useModel('quanlyclb.danhsach');

	useEffect(() => {
		fetchClubs(tableParams);
	}, []);

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

	return (
		<div>
			{!viewingMembers ? (
				<Card
					title='Danh sách câu lạc bộ'
					extra={
						<Button type='primary' icon={<PlusOutlined />} onClick={handleAddClub}>
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
