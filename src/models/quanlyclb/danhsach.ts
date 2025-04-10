import type { Club, ClubTableParams } from '@/models/club';
import { deleteClub, getClubs } from '@/services/QuanLyCauLacBo/club';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
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

	return {
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
	};
};
