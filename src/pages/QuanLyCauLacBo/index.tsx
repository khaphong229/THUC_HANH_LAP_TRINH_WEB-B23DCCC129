import React, { useState } from 'react';
import { Tabs } from 'antd';
import DanhSach from './DanhSach';
import DonDangKy from './DonDangKy';
import ThanhVien from './ThanhVien';
import BaoCao from './BaoCao';
const { TabPane } = Tabs;

const QuanLyVanBang: React.FC = () => {
	const [activeKey, setActiveKey] = useState('1');

	const handleTabChange = (key: string) => {
		setActiveKey(key);
	};

	return (
		<div className='quanly-vanbang-container'>
			<h1>Quản lý Câu Lạc Bộ</h1>
			<Tabs type='card' activeKey={activeKey} onChange={handleTabChange}>
				<TabPane tab='Danh sách câu lạc bộ' key='1'>
					<DanhSach />
				</TabPane>
				<TabPane tab='Quản lý đơn đăng ký thành viên' key='3'>
					{' '}
					<DonDangKy />{' '}
				</TabPane>
				<TabPane tab='Quản lý thành viên câu lạc bộ' key='4'>
					{' '}
					<ThanhVien />{' '}
				</TabPane>
				<TabPane tab='Báo cáo và thống kê' key='2'>
					{' '}
					<BaoCao />{' '}
				</TabPane>
			</Tabs>
		</div>
	);
};

export default QuanLyVanBang;
