import type { Appointment } from '@/services/Appointment/typing';
import { useState } from 'react';
import dayjs from 'dayjs';
import { appointService } from '@/services/Appointment/api';

export default () => {
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

	return {
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
	};
};
