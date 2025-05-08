import { 
	getDestinations, 
	getItineraries, 
	createItinerary, 
	updateItinerary, 
	deleteItinerary
} from '@/services/KeHoachDuLich/LichTrinh';
import { useState } from 'react';
import { Destination, Itinerary, ItineraryItem } from '@/services/KeHoachDuLich/LichTrinh/typings';

export default () => {
	const [destinations, setDestinations] = useState<Destination[]>([]);
	const [itineraries, setItineraries] = useState<Itinerary[]>([]);
	const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

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
			setItineraries(itineraries.map(item => item.id === id ? res.data : item));
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
			setItineraries(itineraries.filter(item => item.id !== id));
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

	const sortItineraryByDay = (itinerary: Itinerary) => {
		if (!itinerary.items || !itinerary.items.length) return itinerary;
		
		const sortedItems = [...itinerary.items].sort((a, b) => {
	
			if (a.day !== b.day) return a.day - b.day;
	
			return a.order - b.order;
		});
		
		return {
			...itinerary,
			items: sortedItems
		};
	};

	const calculateItineraryDetails = (itinerary: Itinerary, allDestinations: Destination[]) => {
		const destinationMap = new Map<string, Destination>();
		allDestinations.forEach(dest => destinationMap.set(dest.id, dest));
		
		let totalFood = 0;
		let totalTransport = 0;
		let totalAccommodation = 0;
		let totalDuration = 0;
		let totalTravelDistance = 0;
		

		const sortedItinerary = sortItineraryByDay(itinerary);
		const sortedItems = sortedItinerary.items;

		const itemsByDay = new Map<number, ItineraryItem[]>();
		sortedItems.forEach(item => {
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
			
	
			items.forEach(item => {
				const destination = destinationMap.get(item.destinationId);
				if (destination) {
			
					const food = typeof destination.cost.food === 'string' 
						? parseInt(destination.cost.food) 
						: destination.cost.food;

					const transport = typeof destination.cost.transport === 'string' 
						? parseInt(destination.cost.transport) 
						: destination.cost.transport;

					const accommodation = typeof destination.cost.accommodation === 'string' 
						? parseInt(destination.cost.accommodation) 
						: destination.cost.accommodation;

					const visitDuration = typeof destination.visitDuration === 'string'
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
			sortedItems: sortedItems
		};
	};

	return {
		destinations,
		itineraries,
		currentItinerary,
		loading,
		fetchDestinations,
		fetchItineraries,
		addItinerary,
		updateItineraryData,
		removeItinerary,
		setCurrentItinerary,
		calculateItineraryDetails,
		calculateDistance,
		sortItineraryByDay
	};
}; 