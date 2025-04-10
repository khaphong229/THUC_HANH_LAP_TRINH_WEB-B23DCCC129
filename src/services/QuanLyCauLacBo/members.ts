import axios from 'axios';

const API_URL = 'https://67f72c0242d6c71cca643d81.mockapi.io/api/clb/members';

export const getMembers = async () => {
	try {
		const res = await axios.get(API_URL);
		return res;
	} catch (error) {
		console.error('Get members error', error);
		throw error;
	}
};

export const addMember = async (member: any) => {
	try {
		const res = await axios.post(API_URL, member);
		return res;
	} catch (error) {
		console.error('Add member error', error);
		throw error;
	}
};

export const updateMember = async (id: string, member: any) => {
	try {
		const res = await axios.put(`${API_URL}/${id}`, member);
		return res;
	} catch (error) {
		console.error('Update member error', error);
		throw error;
	}
};

export const deleteMember = async (id: string) => {
	try {
		await axios.delete(`${API_URL}/${id}`);
		return id;
	} catch (error) {
		console.error('Delete member error', error);
		throw error;
	}
};
