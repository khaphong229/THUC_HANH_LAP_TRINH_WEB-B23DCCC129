import React from 'react';
import { Tabs } from 'antd';
import { useModel } from 'umi';
import DanhSach from './DanhSach';
import DonDangKy from './DonDangKy';
import ThanhVien from './ThanhVien';
import BaoCao from './BaoCao';
const { TabPane } = Tabs;

const QuanLyCauLacBo: React.FC = () => {
	// Handle directly in component as model integration might be causing issues
	const [activeKey, setActiveKey] = React.useState('1');

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
					<DonDangKy />
				</TabPane>
				<TabPane tab='Quản lý thành viên câu lạc bộ' key='4'>
					<ThanhVien />
				</TabPane>
				<TabPane tab='Báo cáo và thống kê' key='2'>
					<BaoCao />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default QuanLyCauLacBo;
