import { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import CategoryTable from './components/CategoryTable';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/services/KhoiKienThuc/api';
import './index.less';
import { Category } from '@/services/KhoiKienThuc/typing';

export default function KnowledgeCategory() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [name, setName] = useState('');
	const [editingId, setEditingId] = useState<number | null>(null);

	useEffect(() => {
		getCategories().then(setCategories);
	}, []);

	const handleAddOrUpdateCategory = async () => {
		if (!name.trim()) return;
		if (editingId !== null) {
			await updateCategory(editingId, name);
			setCategories(categories.map((cat) => (cat.id === editingId ? { ...cat, name } : cat)));
			setEditingId(null);
		} else {
			const newCategory = await addCategory(name);
			setCategories([...categories, newCategory]);
		}
		setName('');
	};

	const handleDeleteCategory = async (id: number) => {
		await deleteCategory(id);
		setCategories(categories.filter((cat) => cat.id !== id));
	};

	const handleEditCategory = (category: Category) => {
		setName(category.name);
		setEditingId(category.id);
	};

	return (
		<div className='knowledge-category'>
			<h2>Quản lý Khối Kiến Thức</h2>
			<div className='input-group'>
				<Input
					placeholder='Tên khối kiến thức'
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{ width: 300, marginRight: 10 }}
				/>
				<Button type='primary' onClick={handleAddOrUpdateCategory}>
					{editingId !== null ? 'Cập nhật' : 'Thêm'}
				</Button>
			</div>

			<CategoryTable categories={categories} onEdit={handleEditCategory} onDelete={handleDeleteCategory} />
		</div>
	);
}
