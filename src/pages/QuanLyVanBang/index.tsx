import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { useModel } from 'umi';
import SoVanBang from './SoVanBang';
import ThongTinVanBang from './ThongTinVanBang';
import QuyetDinhTotNghiep from './QuyetDinhTotNghiep';
import CauHinhBieuMau from './CauHinhBieuMau';
import TraCuuVanBang from './TraCuuVanBang';

const { TabPane } = Tabs;

const QuanLyVanBang: React.FC = () => {
	const vanBangModel = useModel('sovanbangtypes');
	const [activeKey, setActiveKey] = useState('1');

	useEffect(() => {
		vanBangModel.fetchInitialData();
	}, []);

	const handleTabChange = (key: string) => {
		setActiveKey(key);
	};

	if (vanBangModel.isLoading) {
		return <div>Đang tải dữ liệu...</div>;
	}

	return (
		<div className='quanly-vanbang-container'>
			<h1>Quản lý văn bằng</h1>
			<Tabs activeKey={activeKey} onChange={handleTabChange}>
				<TabPane tab='Sổ văn bằng' key='1'>
					<SoVanBang />
				</TabPane>
				<TabPane tab='Quyết định tốt nghiệp' key='3'>
					<QuyetDinhTotNghiep />
				</TabPane>
				<TabPane tab='Cấu hình biểu mẫu' key='4'>
					<CauHinhBieuMau />
				</TabPane>
				<TabPane tab='Thông tin văn bằng' key='2'>
					<ThongTinVanBang />
				</TabPane>
				<TabPane tab='Tra cứu văn bằng' key='5'>
					<TraCuuVanBang />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default QuanLyVanBang;
