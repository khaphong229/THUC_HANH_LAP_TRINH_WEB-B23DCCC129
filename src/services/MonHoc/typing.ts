export interface Subject {
	id?: string;
	code: string;
	name: string;
	credits: number;
}

export interface Subject {
	_id?: string;
	code: string;
	name: string;
	credits: number;
}

export interface SubjectFormProps {
	initialData?: Subject;
	onSubmit: (formData: Subject) => void;
	isEditing: boolean;
}
