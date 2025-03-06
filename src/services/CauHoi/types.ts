// Định nghĩa enum cho mức độ khó
export enum DifficultyLevel {
	EASY = 'Dễ',
	MEDIUM = 'Trung bình',
	HARD = 'Khó',
	VERY_HARD = 'Rất khó',
}

// Interface cho câu hỏi
export interface Question {
	id: string;
	subject: string;
	content: string;
	difficultyLevel: DifficultyLevel;
	knowledgeBlock: string;
}
