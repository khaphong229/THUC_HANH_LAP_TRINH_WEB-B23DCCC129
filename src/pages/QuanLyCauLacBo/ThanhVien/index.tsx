import React, { useEffect } from 'react';
import { Table, Typography } from 'antd';
import { getMembers } from '@/services/QuanLyCauLacBo/members';
import { useModel } from 'umi';
import { fakeDataMembers } from '@/constants/quanlyclb/thanhvien';

const { Title } = Typography;

const MemberList: React.FC = () => {
	const { members, setMembers, loading, setLoading } = useModel('quanlyclb.thanhvien');

	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const response = await getMembers();

				if (response.data.length === 0) {
					setMembers(fakeDataMembers);
				} else {
					const approvedMembers = response.data.filter((member: any) => member.status === 'Approved');
					setMembers(approvedMembers);
				}
			} catch (error) {
				console.error('Error fetching members:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchMembers();
	}, []);

	const columns = [
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
			key: 'fullName',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'SĐT',
			dataIndex: 'phone',
			key: 'phone',
		},
		{
			title: 'Giới tính',
			dataIndex: 'gender',
			key: 'gender',
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'clubName',
			key: 'clubName',
		},
	];

	return (
		<div>
			<Title level={3}>Danh sách thành viên</Title>
			<Table columns={columns} dataSource={members} rowKey='id' loading={loading} pagination={{ pageSize: 10 }} />
		</div>
	);
};

export default MemberList;
