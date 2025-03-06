import { useState, useEffect } from 'react';
import '../index.less';

interface Category {
	id: number;
	name: string;
}

export default function KnowledgeCategory() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [name, setName] = useState('');
	const [editingId, setEditingId] = useState<number | null>(null);

	useEffect(() => {
		fetch('https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/categories')
			.then((res) => res.json())
			.then((data) => setCategories(data))
			.catch((err) => console.error('Lỗi khi tải danh mục:', err));
	}, []);

	const addCategory = () => {
		if (!name.trim()) return;
		if (editingId !== null) {
			fetch(`https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/categories/${editingId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name }),
			}).then(() => {
				setCategories(categories.map((cat) => (cat.id === editingId ? { ...cat, name } : cat)));
				setEditingId(null);
				setName('');
			});
		} else {
			fetch('https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name }),
			})
				.then((res) => res.json())
				.then((newCategory) => {
					setCategories([...categories, newCategory]);
					setName('');
				});
		}
	};

	const removeCategory = (id: number) => {
		fetch(`https://67c911ae0acf98d070888f0a.mockapi.io/api/thweb/categories/${id}`, { method: 'DELETE' })
			.then(() => {
				setCategories(categories.filter((cat) => cat.id !== id));
			})
			.catch((err) => console.error('Lỗi khi xóa danh mục:', err));
	};

	const editCategory = (category: Category) => {
		setName(category.name);
		setEditingId(category.id);
	};

	return (
		<div className='knowledge-category'>
			<h2>Quản lý Khối Kiến Thức</h2>
			<div className='input-group'>
				<input type='text' placeholder='Tên khối kiến thức' value={name} onChange={(e) => setName(e.target.value)} />
				<button onClick={addCategory}>{editingId !== null ? 'Cập nhật' : 'Thêm'}</button>
			</div>
			<ul>
				{categories.map((category) => (
					<li key={category.id} className='category-item'>
						{category.name}
						<div>
							<button onClick={() => editCategory(category)}>Sửa</button>
							<button onClick={() => removeCategory(category.id)}>Xóa</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
