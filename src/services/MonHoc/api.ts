import axios from 'axios';
import { Subject } from './types';

const API_URL = 'https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/subjects';

export const subjectService = {
	getAllSubjects: async (): Promise<Subject[]> => {
		const response = await axios.get(API_URL);
		return response.data;
	},

	getSubjectById: async (id: string): Promise<Subject> => {
		const response = await axios.get(`${API_URL}/${id}`);
		return response.data;
	},

	createSubject: async (subject: Omit<Subject, 'id'>): Promise<Subject> => {
		const response = await axios.post(API_URL, subject);
		return response.data;
	},

	updateSubject: async (id: string, subject: Omit<Subject, 'id'>): Promise<Subject> => {
		const response = await axios.put(`${API_URL}/${id}`, subject);
		return response.data;
	},

	deleteSubject: async (id: string): Promise<void> => {
		await axios.delete(`${API_URL}/${id}`);
	},
};
