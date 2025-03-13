import axios from 'axios';
import { Appointment,Statuss } from './typing';

const API_URL = 'https://67d23c7b90e0670699bcbe86.mockapi.io/api/lich-hen';

export const appointService = {
    getAllAppointment: async (): Promise<Appointment[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    getAppointmentById: async (id: string): Promise<Appointment> => {
		const response = await axios.get(`${API_URL}/${id}`);
		return response.data;
	},

    createAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
		const response = await axios.post(API_URL, appointment);
		return response.data;
	},
    updateAppointment: async (id: string, appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
		const response = await axios.put(`${API_URL}/${id}`, appointment);
		return response.data;
	},
    deleteAppointment: async (id: string): Promise<void> => {
		await axios.delete(`${API_URL}/${id}`);
	},

}