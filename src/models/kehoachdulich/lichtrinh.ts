import {
	getDestinations,
	getItineraries,
	createItinerary,
	updateItinerary,
	deleteItinerary,
} from '@/services/KeHoachDuLich/LichTrinh';
import { useState } from 'react';
import type { Destination, Itinerary, ItineraryItem } from '@/services/KeHoachDuLich/LichTrinh/typings';
import { Form, message } from 'antd';
import dayjs from 'dayjs';

export default () => {
	const [destinations, setDestinations] = useState<Destination[]>([]);
	const [itineraries, setItineraries] = useState<Itinerary[]>([]);
	const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [currentDay, setCurrentDay] = useState<number>(1);
	const [selectedDestination, setSelectedDestination] = useState<string>('');
	const [destinationsForDay, setDestinationsForDay] = useState<ItineraryItem[]>([]);
	const [budgetData, setBudgetData] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [sortedItems, setSortedItems] = useState<ItineraryItem[]>([]);
	const [sortType, setSortType] = useState<string>('date-asc');
	const [sortedItineraries, setSortedItineraries] = useState<Itinerary[]>([]);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

	const [editForm] = Form.useForm();

	const fetchDestinations = async () => {
		setLoading(true);
		try {
			const res = await getDestinations();
			setDestinations(res.data || []);
		} catch (error) {
			console.error('Error fetching destinations:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchItineraries = async () => {
		setLoading(true);
		try {
			const res = await getItineraries();
			setItineraries(res.data || []);
		} catch (error) {
			console.error('Error fetching itineraries:', error);
		} finally {
			setLoading(false);
		}
	};

	const addItinerary = async (itinerary: Omit<Itinerary, 'id'>) => {
		setLoading(true);
		try {
			const res = await createItinerary(itinerary);
			setItineraries([...itineraries, res.data]);
			return res.data;
		} catch (error) {
			console.error('Error creating itinerary:', error);
			return null;
		} finally {
			setLoading(false);
		}
	};

	const updateItineraryData = async (id: string, data: Partial<Itinerary>) => {
		setLoading(true);
		try {
			const res = await updateItinerary(id, data);
			setItineraries(itineraries.map((item) => (item.id === id ? res.data : item)));
			if (currentItinerary?.id === id) {
				setCurrentItinerary(res.data);
			}
			return res.data;
		} catch (error) {
			console.error('Error updating itinerary:', error);
			return null;
		} finally {
			setLoading(false);
		}
	};

	const removeItinerary = async (id: string) => {
		setLoading(true);
		try {
			await deleteItinerary(id);
			setItineraries(itineraries.filter((item) => item.id !== id));
			if (currentItinerary?.id === id) {
				setCurrentItinerary(null);
			}
			return true;
		} catch (error) {
			console.error('Error deleting itinerary:', error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const calculateDistance = (location1: string, location2: string) => {
		const loc1 = parseInt(location1) || 0;
		const loc2 = parseInt(location2) || 0;

		return Math.abs(loc1 - loc2);
	};

	const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result.map((item, index) => ({
			...item,
			order: index + 1,
		}));
	};

	const sortItineraryByDay = (itinerary: Itinerary) => {
		if (!itinerary.items || !itinerary.items.length) return itinerary;

		const sortedItems = [...itinerary.items].sort((a, b) => {
			if (a.day !== b.day) return a.day - b.day;

			return a.order - b.order;
		});

		return {
			...itinerary,
			items: sortedItems,
		};
	};

	const calculateItineraryDetails = (itinerary: Itinerary, allDestinations: Destination[]) => {
		const destinationMap = new Map<string, Destination>();
		allDestinations.forEach((dest) => destinationMap.set(dest.id, dest));

		let totalFood = 0;
		let totalTransport = 0;
		let totalAccommodation = 0;
		let totalDuration = 0;
		let totalTravelDistance = 0;

		const sortedItinerary = sortItineraryByDay(itinerary);
		const sortedItems = sortedItinerary.items;

		const itemsByDay = new Map<number, ItineraryItem[]>();
		sortedItems.forEach((item) => {
			if (!itemsByDay.has(item.day)) {
				itemsByDay.set(item.day, []);
			}
			const dayItems = itemsByDay.get(item.day);
			if (dayItems) {
				dayItems.push(item);
			}
		});

		itemsByDay.forEach((items, day) => {
			items.sort((a, b) => a.order - b.order);

			for (let i = 0; i < items.length - 1; i++) {
				const currentDest = destinationMap.get(items[i].destinationId);
				const nextDest = destinationMap.get(items[i + 1].destinationId);

				if (currentDest && nextDest) {
					const distance = calculateDistance(currentDest.location, nextDest.location);
					totalTravelDistance += distance;
				}
			}

			items.forEach((item) => {
				const destination = destinationMap.get(item.destinationId);
				if (destination) {
					const food =
						typeof destination.cost.food === 'string' ? parseInt(destination.cost.food) : destination.cost.food;

					const transport =
						typeof destination.cost.transport === 'string'
							? parseInt(destination.cost.transport)
							: destination.cost.transport;

					const accommodation =
						typeof destination.cost.accommodation === 'string'
							? parseInt(destination.cost.accommodation)
							: destination.cost.accommodation;

					const visitDuration =
						typeof destination.visitDuration === 'string'
							? parseInt(destination.visitDuration)
							: destination.visitDuration;

					totalFood += food || 0;
					totalAccommodation += accommodation || 0;
					totalTransport += transport || 0;
					totalDuration += visitDuration || 0;
				}
			});
		});

		return {
			budget: {
				food: totalFood,
				transport: totalTransport,
				accommodation: totalAccommodation,
				total: totalFood + totalTransport + totalAccommodation,
			},
			duration: totalDuration,
			travelDistance: totalTravelDistance,
			sortedItems: sortedItems,
		};
	};

	const handleCreateItinerary = async (values: any) => {
		try {
			const dateRange = values.dateRange;
			const startDate = dateRange[0].format('YYYY-MM-DD');
			const endDate = dateRange[1].format('YYYY-MM-DD');

			const newItinerary: Omit<Itinerary, 'id'> = {
				name: values.name,
				startDate: startDate,
				endDate: endDate,
				items: [],
				totalBudget: values.totalBudget,
				user: 'User hiện tại',
			};

			const result = await addItinerary(newItinerary);
			if (result) {
				setCurrentItinerary(result);
				setEditMode(true);
				setIsModalOpen(false);
				message.success('Tạo lịch trình thành công!');
			}
		} catch (err) {
			message.error('Không thể tạo lịch trình. Vui lòng thử lại sau.');
			console.error('Error creating itinerary:', err);
		}
	};

	const handleEditItinerary = () => {
		if (!currentItinerary) return;

		editForm.setFieldsValue({
			name: currentItinerary.name,
			dateRange: [dayjs(currentItinerary.startDate), dayjs(currentItinerary.endDate || currentItinerary.startDate)],
			totalBudget: currentItinerary.totalBudget,
		});

		setIsEditModalOpen(true);
	};

	const handleUpdateItinerary = async (values: any) => {
		try {
			if (!currentItinerary) return;

			const dateRange = values.dateRange;
			const startDate = dateRange[0].format('YYYY-MM-DD');
			const endDate = dateRange[1].format('YYYY-MM-DD');

			const updatedItinerary: Partial<Itinerary> = {
				name: values.name,
				startDate: startDate,
				endDate: endDate,
				totalBudget: values.totalBudget,
			};

			const result = await updateItineraryData(currentItinerary.id, updatedItinerary);
			if (result) {
				setIsEditModalOpen(false);
				message.success('Cập nhật lịch trình thành công!');
			}
		} catch (err) {
			message.error('Không thể cập nhật lịch trình. Vui lòng thử lại sau.');
			console.error('Error updating itinerary:', err);
		}
	};

	const handleAddDestination = () => {
		try {
			if (!selectedDestination || !currentItinerary) return;

			const exists = destinationsForDay.some((item) => item.destinationId === selectedDestination);
			if (exists) {
				message.warning('Điểm đến này đã được thêm vào ngày hiện tại!');
				return;
			}

			const newItem: ItineraryItem = {
				destinationId: selectedDestination,
				day: currentDay,
				order: destinationsForDay.length + 1,
			};

			const updatedItems = [...(currentItinerary.items || []), newItem];
			updateItineraryData(currentItinerary.id, { items: updatedItems });
			setSelectedDestination('');
		} catch (err) {
			message.error('Không thể thêm điểm đến. Vui lòng thử lại.');
			console.error('Error adding destination:', err);
		}
	};

	const handleRemoveDestination = (destinationId: string) => {
		try {
			if (!currentItinerary) return;

			const updatedItems = currentItinerary.items.filter(
				(item) => !(item.day === currentDay && item.destinationId === destinationId),
			);

			updateItineraryData(currentItinerary.id, { items: updatedItems });
		} catch (err) {
			message.error('Không thể xóa điểm đến. Vui lòng thử lại.');
			console.error('Error removing destination:', err);
		}
	};

	const onDragEnd = (result: any) => {
		try {
			if (!result.destination || !currentItinerary) return;

			const updatedDestinationsForDay = reorder(destinationsForDay, result.source.index, result.destination.index);

			const otherItems = currentItinerary.items.filter((item) => item.day !== currentDay);
			const allItems = [...otherItems, ...updatedDestinationsForDay];

			updateItineraryData(currentItinerary.id, { items: allItems });
		} catch (err) {
			message.error('Không thể cập nhật thứ tự. Vui lòng thử lại.');
			console.error('Error during drag and drop:', err);
		}
	};

	return {
		destinations,
		itineraries,
		currentItinerary,
		loading,
		isModalOpen,
		setIsModalOpen,
		editMode,
		setEditMode,
		currentDay,
		setCurrentDay,
		selectedDestination,
		setSelectedDestination,
		destinationsForDay,
		setDestinationsForDay,
		budgetData,
		setBudgetData,
		error,
		setError,
		sortedItems,
		setSortedItems,
		sortType,
		setSortType,
		sortedItineraries,
		setSortedItineraries,
		isEditModalOpen,
		setIsEditModalOpen,
		fetchDestinations,
		fetchItineraries,
		addItinerary,
		updateItineraryData,
		removeItinerary,
		setCurrentItinerary,
		calculateItineraryDetails,
		calculateDistance,
		sortItineraryByDay,
		handleCreateItinerary,
		handleEditItinerary,
		handleUpdateItinerary,
		handleAddDestination,
		handleRemoveDestination,
		onDragEnd,
		editForm,
	};
};
