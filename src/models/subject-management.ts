import { useState } from 'react';
import type { IRecord } from '@/services/Subject/typing';

export default () => {
	const [subs, setSubs] = useState<IRecord[]>([]);
	const [currentSubs, setCurrentSubs] = useState<IRecord | null>(null);
	const [openForm, setOpenForm] = useState<boolean>(false);
	const [selectedSub, setSelectedSub] = useState<IRecord | null>(null);

	const getSubsList = () => {
		const subsString = localStorage.getItem('subjects');
		const subsObj: IRecord[] = JSON.parse(subsString || '[]');
		setSubs(subsObj);
	};

	const addSub = (name: string) => {
		const newSub: IRecord = {
			id: new Date().toISOString(),
			name,
		};
		setSubs((prev) => [...prev, newSub]);
		localStorage.setItem('subjects', JSON.stringify([...subs, newSub]));
	};

	const startEdit = (id: string) => {
		const findedSub = subs.find((sub) => sub.id === id);
		if (findedSub) {
			setCurrentSubs(findedSub);
		}
	};

	const editSub = (name: string) => {
		setCurrentSubs((prev) => {
			if (prev) return { ...prev, name };
			return null;
		});
	};

	const finishEdit = () => {
		if (!currentSubs) return;
		const newSubs = subs.map((sub) => {
			if (sub.id === currentSubs.id) {
				return currentSubs;
			}
			return sub;
		});
		setSubs(newSubs);
		setCurrentSubs(null);
		localStorage.setItem('subjects', JSON.stringify(newSubs));
	};

	const deleteSub = (id: string) => {
		const newSubs = subs.filter((sub) => sub.id !== id);
		setSubs(newSubs);
		localStorage.setItem('subjects', JSON.stringify(newSubs));
	};

	const handleCardClick = (sub: IRecord) => {
		setSelectedSub(sub);
		setOpenForm(true);
	};

	const handleCloseDetails = () => {
		setOpenForm(false);
		setSelectedSub(null);
	};

	const handleEditFromTable = (id: string) => {
		startEdit(id);
		setOpenForm(false);
	};

	const handleDeleteFromTable = (id: string) => {
		deleteSub(id);
		setOpenForm(false);
	};

	return {
		subs,
		currentSubs,
		openForm,
		selectedSub,
		getSubsList,
		addSub,
		startEdit,
		editSub,
		finishEdit,
		deleteSub,
		handleCardClick,
		handleCloseDetails,
		handleEditFromTable,
		handleDeleteFromTable,
	};
};
