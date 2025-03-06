export interface Category {
	id: number;
	name: string;
}

export interface CategoryTableProps {
	categories: Category[];
	onEdit: (category: Category) => void;
	onDelete: (id: number) => void;
}
