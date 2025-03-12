const API_URL = 'https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/categories';

export const getCategories = async () => {
	try {
		const res = await fetch(API_URL);
		return res.json();
	} catch (err) {
		console.error('Lỗi khi tải danh mục:', err);
		return [];
	}
};

export const addCategory = async (name: string) => {
	const res = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name }),
	});
	return res.json();
};

export const updateCategory = async (id: number, name: string) => {
	await fetch(`${API_URL}/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name }),
	});
};

export const deleteCategory = async (id: number) => {
	await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};
