import { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, DatePicker, Radio, Select, Typography, Table, Progress, Statistic } from 'antd';
import { appointService } from '../../../services/Appointment/api';
import type { Appointment } from './typing';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function Index() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
	const [viewType, setViewType] = useState<'day' | 'month'>('day');
	const [statusFilter, setStatusFilter] = useState<string | null>(null);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			const data = await appointService.getAllAppointment();
			setAppointments(data);
			setLoading(false);
		} catch (err) {
			setError('Không thể tải dữ liệu lịch hẹn');
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchAppointments();
	}, []);

	const getFilteredAppointments = () => {
		let filtered = [...appointments];

		if (dateRange && dateRange[0] && dateRange[1]) {
			filtered = filtered.filter((appointment) => {
				// Skip appointments with invalid date format
				if (!appointment.day || !appointment.day.match(/^\d{4}-\d{2}-\d{2}$/)) {
					return false;
				}

				const appointmentDate = dayjs(appointment.day);
				return appointmentDate.isAfter(dateRange[0]) && appointmentDate.isBefore(dateRange[1]);
			});
		}

		if (statusFilter) {
			filtered = filtered.filter((appointment) => appointment.status === statusFilter);
		}

		return filtered;
	};

	const getAppointmentsByDay = () => {
		const filtered = getFilteredAppointments();
		const groupedByDay: Record<string, number> = {};

		filtered.forEach((appointment) => {
			if (appointment.day && appointment.day.match(/^\d{4}-\d{2}-\d{2}$/)) {
				if (groupedByDay[appointment.day]) {
					groupedByDay[appointment.day]++;
				} else {
					groupedByDay[appointment.day] = 1;
				}
			}
		});

		return Object.entries(groupedByDay)
			.map(([day, count]) => ({
				key: day,
				day,
				count,
			}))
			.sort((a, b) => a.day.localeCompare(b.day));
	};

	const getAppointmentsByMonth = () => {
		const filtered = getFilteredAppointments();
		const groupedByMonth: Record<string, number> = {};

		filtered.forEach((appointment) => {
			if (appointment.day && appointment.day.match(/^\d{4}-\d{2}-\d{2}$/)) {
				const month = appointment.day.substring(0, 7); // Format: YYYY-MM
				if (groupedByMonth[month]) {
					groupedByMonth[month]++;
				} else {
					groupedByMonth[month] = 1;
				}
			}
		});

		return Object.entries(groupedByMonth)
			.map(([month, count]) => ({
				key: month,
				month,
				count,
			}))
			.sort((a, b) => a.month.localeCompare(b.month));
	};

	const getAppointmentsByStatus = () => {
		const filtered = getFilteredAppointments();
		const groupedByStatus: Record<string, number> = {};
		const total = filtered.length;

		filtered.forEach((appointment) => {
			if (groupedByStatus[appointment.status]) {
				groupedByStatus[appointment.status]++;
			} else {
				groupedByStatus[appointment.status] = 1;
			}
		});

		return Object.entries(groupedByStatus).map(([status, count]) => ({
			key: status,
			status,
			count,
			percentage: total > 0 ? Math.round((count / total) * 100) : 0,
		}));
	};

	const getUniqueStatuses = () => {
		const statuses = new Set<string>();
		appointments.forEach((appointment) => {
			if (appointment.status) {
				statuses.add(appointment.status);
			}
		});
		return Array.from(statuses);
	};

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
