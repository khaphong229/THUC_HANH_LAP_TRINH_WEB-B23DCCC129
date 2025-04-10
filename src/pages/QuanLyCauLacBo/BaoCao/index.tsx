import React, { useState } from 'react';
import { Button, Typography, Row, Col } from 'antd';
import { Column } from '@ant-design/charts';
import * as XLSX from 'xlsx';
import { dataReportReport } from '@/constants/quanlyclb/baocao';

const { Title } = Typography;

const Report: React.FC = () => {
	const [dataReport, setDataReport] = useState(dataReportReport);
	// Xuất danh sách thành viên đã phê duyệt ra file XLSX
	const exportToXLSX = () => {
		const approvedMembers = [
			{ fullName: 'Nguyễn Văn A', email: 'nguyenvana@example.com', clubName: 'CLB Tin học' },
			{ fullName: 'Trần Thị B', email: 'tranthib@example.com', clubName: 'CLB Văn nghệ' },
		];

		const worksheet = XLSX.utils.json_to_sheet(approvedMembers);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Approved Members');
		XLSX.writeFile(workbook, 'approved_members.xlsx');
	};

	return (
		<div>
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
		</div>
	);
};

export default Report;
