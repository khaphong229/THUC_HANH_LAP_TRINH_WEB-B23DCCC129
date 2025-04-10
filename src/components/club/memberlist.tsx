import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Tag, Spin } from 'antd';
import { Member } from '../../models/member';
import { Club } from '../../models/club';
import { getClubById } from '../../services/QuanLyCauLacBo/club';
import { getClubMembers } from '../../services/QuanLyCauLacBo/member';
import { message } from 'antd';
interface MemberListProps {
	clubId: number;
	onBack: () => void;
}

const MemberList: React.FC<MemberListProps> = ({ clubId, onBack }) => {
	const [members, setMembers] = useState<Member[]>([]);
	const [club, setClub] = useState<Club | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [tableParams, setTableParams] = useState({
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		clubId,
	});

	const fetchClub = async () => {
		try {
			const data = await getClubById(clubId);
			setClub(data);
		} catch (error) {
			message.error('Không thể tải thông tin câu lạc bộ');
		}
	};

	const fetchMembers = async () => {
		setLoading(true);
		try {
			const { data, total } = await getClubMembers({
				...tableParams,
				clubId,
			});
			setMembers(data);
			setTableParams({
				...tableParams,
				pagination: {
					...tableParams.pagination,
					total,
				},
			});
		} catch (error) {
			message.error('Không thể tải danh sách thành viên');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchClub();
		fetchMembers();
	}, [clubId, tableParams.pagination.current, tableParams.pagination.pageSize]);

	const handleTableChange = (pagination: any, filters: any, sorter: any) => {
		const newParams = {
			...tableParams,
			pagination,
			filters,
			sorter: sorter.field && sorter.order ? { field: sorter.field, order: sorter.order } : undefined,
		};

		setTableParams(newParams);
	};

	const columns = [
		{
			title: 'Họ và tên',
			dataIndex: 'fullName',
			key: 'fullName',
			sorter: true,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
		},
		{
			title: 'Giới tính',
			dataIndex: 'gender',
			key: 'gender',
			render: (gender: string) => (
				<Tag color={gender === 'Male' ? 'blue' : 'pink'}>{gender === 'Male' ? 'Nam' : 'Nữ'}</Tag>
			),
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'address',
			key: 'address',
		},
	];

	return (
		<Card title={`Thành viên câu lạc bộ ${club?.name || ''}`} extra={<Button onClick={onBack}>Quay lại</Button>}>
			{!club ? (
				<Spin tip='Đang tải thông tin...' />
			) : (
				<Table
					rowKey='id'
					dataSource={members}
					columns={columns}
					loading={loading}
					pagination={{
						current: tableParams.pagination.current,
						pageSize: tableParams.pagination.pageSize,
						total: tableParams.pagination.total,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total) => `Tổng: ${total} thành viên`,
					}}
					onChange={handleTableChange}
				/>
			)}
		</Card>
	);
};

export default MemberList;
