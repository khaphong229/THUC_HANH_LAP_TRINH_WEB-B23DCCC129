import axios from 'axios';
import { Question, DifficultyLevel } from './typing';

const API_URL = 'https://67c9224d0acf98d07088f20e.mockapi.io/api/bankquestions/questions';

export const questionService = {
	getAllQuestions: async (): Promise<Question[]> => {
		const response = await axios.get(API_URL);
		return response.data;
	},

	getQuestionById: async (id: string): Promise<Question> => {
		const response = await axios.get(`${API_URL}/${id}`);
		return response.data;
	},

	createQuestion: async (question: Omit<Question, 'id'>): Promise<Question> => {
		const response = await axios.post(API_URL, question);
		return response.data;
	},

	updateQuestion: async (id: string, question: Omit<Question, 'id'>): Promise<Question> => {
		const response = await axios.put(`${API_URL}/${id}`, question);
		return response.data;
	},

	deleteQuestion: async (id: string): Promise<void> => {
		await axios.delete(`${API_URL}/${id}`);
	},

	searchQuestions: async (params: {
		subject?: string;
		difficultyLevel?: DifficultyLevel;
		knowledgeBlock?: string;
	}): Promise<Question[]> => {
		const response = await axios.get(API_URL, { params });
		return response.data;
	},
};
