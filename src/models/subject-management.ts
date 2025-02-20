import { useState } from 'react';

interface Subject {
	id: string;
	name: string;
	time: string | null;
	duration: string | null;
	content: string | null;
	notes?: string | null;
}

export default () => {
	const [subs, setSubs] = useState<Subject[]>([]);
	const [currentSubs, setCurrentSubs] = useState<Subject | null>(null);

	const getSubsList = () => {
		const subsString = localStorage.getItem('subs');
		const subsObj: Subject[] = JSON.parse(subsString || '[]');
		setSubs(subsObj);
	};

	const syncToLocal = (handler: (subs: Subject[]) => Subject[]) => {
		const subsString = localStorage.getItem('subs');
		const subsObj: Subject[] = JSON.parse(subsString || '[]');
		const newSubsObj = handler(subsObj);
		localStorage.setItem('subs', JSON.stringify(newSubsObj));
	};

	const addSub = (name: string) => {
		const sub: Subject = {
			name,
			time: null,
			duration: null,
			content: null,
			notes: null,
			id: new Date().toISOString(),
		};
		setSubs((prev) => [...prev, sub]);
		syncToLocal((subsObj) => [...subsObj, sub]);
	};

	const updateSubStatus = (id: string, done: boolean) => {
		setSubs((prev) => {
			return prev.map((sub) => {
				if (sub.id === id) {
					return { ...sub, done };
				}
				return sub;
			});
		});
		setSubs((prev) => {
			return prev.map((sub) => {
				if (sub.id === id) {
					return { ...sub, done };
				}
				return sub;
			});
		});
	};

	const startEdit = (id: string) => {
		const findedTodo = subs.find((sub) => sub.id === id);
		if (findedTodo) {
			setCurrentSubs(findedTodo);
		}
	};

	const editSub = (name: string) => {
		setCurrentSubs((prev: Subject | null) => {
			if (prev) return { ...prev, name };
			return null;
		});
	};

	const finishEdit = () => {
		const handler = (subObj: Subject[]) => {
			return subObj.map((sub) => {
				if (sub.id === (currentSubs as Subject).id) {
					return currentSubs as Subject;
				}
				return sub;
			});
		};
		setSubs(handler);
		setCurrentSubs(null);
		syncToLocal(handler);
	};

	const deleteSub = (id: string) => {
		if (currentSubs) {
			setCurrentSubs(null);
		}
		const handler = (subObj: Subject[]) => {
			const findedIndexSub = subObj.findIndex((sub) => sub.id === id);
			if (findedIndexSub > -1) {
				const result = [...subObj];
				result.splice(findedIndexSub, 1);
				return result;
			}
			return subObj;
		};
		setSubs(handler);
		syncToLocal(handler);
	};

	return {
		subs,
		currentSubs,
		getSubsList,
		addSub,
		updateSubStatus,
		startEdit,
		editSub,
		finishEdit,
		deleteSub,
	};
};
