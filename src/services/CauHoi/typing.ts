export enum DifficultyLevel {
	EASY = 'Dễ',
	MEDIUM = 'Trung bình',
	HARD = 'Khó',
	VERY_HARD = 'Rất khó',
}

export interface Question {
	id: string;
	subject: string;
	content: string;
	difficultyLevel: DifficultyLevel;
	knowledgeBlock: string;
}

export interface KnowledgeBlock {
	id: string;
	name: string;
}

export interface Subject {
	id: string;
	name: string;
}

export interface QuestionFormProps {
	visible: boolean;
	onCancel: () => void;
	onSave: (values: any) => void;
	initialValues: Question | null;
	subjects: string[];
}
