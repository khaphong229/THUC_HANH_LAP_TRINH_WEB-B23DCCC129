import axios from 'axios';

const API_URL = 'https://681c1b296ae7c794cf70afff.mockapi.io/trip/destinations';

export const fetchDestinations = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data;
	} catch (error) {
		console.error('Lỗi khi lấy dữ liệu:', error);
		throw error;
	}
};
