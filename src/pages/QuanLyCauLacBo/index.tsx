import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { useModel } from 'umi';

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
				<TabPane tab='Danh sách câu lạc bộ' key='1' />
				<TabPane tab='Quản lý đơn đăng ký thành viên' key='3' />
				<TabPane tab='Quản lý thành viên câu lạc bộ' key='4' />
				<TabPane tab='Báo cáo và thống kê' key='2' />
			</Tabs>
		</div>
	);
};

export default QuanLyVanBang;
