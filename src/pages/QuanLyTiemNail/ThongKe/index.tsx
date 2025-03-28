import { useEffect } from 'react';
import { Card, Row, Col, Spin, DatePicker, Radio, Select, Typography, Table, Progress, Statistic } from 'antd';
import useThongKe from '@/models/thongke';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function Index() {
	const {
		loading,
		error,
		setDateRange,
		viewType,
		setViewType,
		setStatusFilter,
		fetchAppointments,
		getFilteredAppointments,
		getAppointmentsByDay,
		getAppointmentsByMonth,
		getAppointmentsByStatus,
		getUniqueStatuses,
	} = useThongKe();

	useEffect(() => {
		fetchAppointments();
	}, []);

	const dayColumns = [
		{
			title: 'Ngày',
			dataIndex: 'day',
			key: 'day',
		},
		{
			title: 'Số lượng lịch hẹn',
			dataIndex: 'count',
			key: 'count',
			sorter: (a: any, b: any) => a.count - b.count,
		},
	];

	const monthColumns = [
		{
			title: 'Tháng',
			dataIndex: 'month',
			key: 'month',
			render: (text: string) => {
				const [year, month] = text.split('-');
				return `Tháng ${month}/${year}`;
			},
		},
		{
			title: 'Số lượng lịch hẹn',
			dataIndex: 'count',
			key: 'count',
			sorter: (a: any, b: any) => a.count - b.count,
		},
	];

	const statusColumns = [
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
		},
		{
			title: 'Số lượng',
			dataIndex: 'count',
			key: 'count',
		},
		{
			title: 'Phần trăm',
			dataIndex: 'percentage',
			key: 'percentage',
			render: (percentage: number) => <Progress percent={percentage} size='small' />,
		},
	];

	const getTotalAppointments = () => {
		return getFilteredAppointments().length;
	};

	if (loading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<Spin size='large' />
			</div>
		);
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div>
			<Title level={4}>Thống Kê Lịch Hẹn</Title>

			<Card style={{ marginBottom: '20px' }}>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} sm={8}>
						<RangePicker
							style={{ width: '100%' }}
							onChange={(dates) => {
								if (dates) {
									setDateRange([dates[0]!, dates[1]!]);
								} else {
									setDateRange(null);
								}
							}}
						/>
					</Col>
					<Col xs={24} sm={8}>
						<Radio.Group value={viewType} onChange={(e) => setViewType(e.target.value)} buttonStyle='solid'>
							<Radio.Button value='day'>Theo ngày</Radio.Button>
							<Radio.Button value='month'>Theo tháng</Radio.Button>
						</Radio.Group>
					</Col>
					<Col xs={24} sm={8}>
						<Select
							style={{ width: '100%' }}
							placeholder='Lọc theo trạng thái'
							allowClear
							onChange={(value) => setStatusFilter(value)}
						>
							{getUniqueStatuses().map((status) => (
								<Option key={status} value={status}>
									{status}
								</Option>
							))}
						</Select>
					</Col>
				</Row>
			</Card>

			<Row gutter={[16, 16]}>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Tổng số lịch hẹn' value={getTotalAppointments()} valueStyle={{ color: '#1890ff' }} />
					</Card>
				</Col>
				<Col xs={24} md={18}>
					<Card title={viewType === 'day' ? 'Số lượng lịch hẹn theo ngày' : 'Số lượng lịch hẹn theo tháng'}>
						<Table
							dataSource={viewType === 'day' ? getAppointmentsByDay() : getAppointmentsByMonth()}
							columns={viewType === 'day' ? dayColumns : monthColumns}
							pagination={{ pageSize: 5 }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
				<Col xs={24}>
					<Card title='Phân bố theo trạng thái'>
						<Table dataSource={getAppointmentsByStatus()} columns={statusColumns} pagination={false} />
					</Card>
				</Col>
			</Row>
		</div>
	);
}
