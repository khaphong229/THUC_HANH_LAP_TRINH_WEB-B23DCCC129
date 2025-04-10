import React, { useState } from 'react';
import { Button, Typography, Row, Col, Card } from 'antd';
import { Column } from '@ant-design/charts';
import * as XLSX from 'xlsx';
import { approvedMembers, fakeDataReport } from '@/constants/quanlyclb/baocao';

const { Title } = Typography;

const Report: React.FC = () => {
	const [dataReport, setDataReport] = useState(fakeDataReport);

	const exportToXLSX = () => {
		const worksheet = XLSX.utils.json_to_sheet(approvedMembers);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Approved Members');
		XLSX.writeFile(workbook, 'approved_members.xlsx');
	};

	return (
		<div>
			<Card>
				<Title level={3}>Báo Cáo</Title>
				<Row gutter={16}>
					<Col span={8}>
						<Title level={4}>Số CLB: {dataReport.totalClubs}</Title>
					</Col>
					<Col span={8}>
						<Title level={4}>Số đơn đăng ký Pending: {dataReport.totalApplications.pending}</Title>
					</Col>
					<Col span={8}>
						<Title level={4}>Số đơn đăng ký Approved: {dataReport.totalApplications.approved}</Title>
					</Col>
					<Col span={8}>
						<Title level={4}>Số đơn đăng ký Rejected: {dataReport.totalApplications.rejected}</Title>
					</Col>
				</Row>

				<Column
					data={dataReport.applicationsByClub}
					xField='clubName'
					yField={['pending', 'approved', 'rejected']}
					seriesField='clubName'
					columnWidthRatio={0.5}
					label={{
						formatter: (v) => `${v}`,
					}}
				/>

				<Button type='primary' onClick={exportToXLSX} style={{ marginTop: '20px' }}>
					Xuất danh sách thành viên đã phê duyệt
				</Button>
			</Card>
		</div>
	);
};

export default Report;
