export interface Appointment {
	id: string;
	day: string;
	hour: string;
	customer: string;
	status: string;
}

export enum Statuss {
	PENDING = 'Chờ duyệt',
	APPROVED = 'Đã duyệt',
	REJECTED = 'Từ chối',
	COMPLETED = 'Hoàn thành',
}
