import { fetchDestinations } from '@/services/KeHoachDuLich/TrangChu/api';
import type { Destination, DestinationType } from '@/services/KeHoachDuLich/TrangChu/types';
import { useState } from 'react';

export default () => {
	const [destinations, setDestinations] = useState<Destination[]>([]);
	const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [selectedTypes, setSelectedTypes] = useState<DestinationType[]>([]);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
	const [minRating, setMinRating] = useState<number>(0);
	const [sortBy, setSortBy] = useState<string>('none');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	const getTotalCost = (destination: Destination): number => {
		return destination.cost.food + destination.cost.transport + destination.cost.accommodation;
	};

	const loadDestinations = async () => {
		try {
			const data = await fetchDestinations();
			setDestinations(data);
			setFilteredDestinations(data);

			if (data.length > 0) {
				const minPrice = Math.min(...data.map((d) => getTotalCost(d)));
				const maxPrice = Math.max(...data.map((d) => getTotalCost(d)));
				setPriceRange([minPrice, maxPrice]);
			}
		} catch (error) {
			console.error('Lỗi khi tải dữ liệu điểm đến', error);
		} finally {
			setLoading(false);
		}
	};

	const filterAndSortDestinations = () => {
		let filtered = [...destinations];

		if (selectedTypes.length > 0) {
			filtered = filtered.filter((dest) => selectedTypes.includes(dest.type));
		}

		filtered = filtered.filter((dest) => {
			const totalCost = getTotalCost(dest);
			return totalCost >= priceRange[0] && totalCost <= priceRange[1];
		});

		filtered = filtered.filter((dest) => dest.rating >= minRating);

		if (sortBy !== 'none') {
			filtered.sort((a, b) => {
				let valueA, valueB;

				if (sortBy === 'name') {
					valueA = a.name;
					valueB = b.name;
					return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
				} else if (sortBy === 'rating') {
					valueA = a.rating;
					valueB = b.rating;
				} else if (sortBy === 'price') {
					valueA = getTotalCost(a);
					valueB = getTotalCost(b);
				}

				return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
			});
		}

		setFilteredDestinations(filtered);
	};

	const handleTypeChange = (values: DestinationType[]) => {
		setSelectedTypes(values);
	};

	const handlePriceChange = (value: [number, number]) => {
		setPriceRange(value);
	};

	const handleRatingChange = (value: number) => {
		setMinRating(value);
	};

	const handleSortChange = (value: string) => {
		setSortBy(value);
	};

	const toggleSortOrder = () => {
		setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
	};

	const formatPrice = (value: number): string => {
		return `${value.toLocaleString()} VND`;
	};

	return {
		destinations,
		setDestinations,
		filteredDestinations,
		setFilteredDestinations,
		loading,
		setLoading,
		selectedTypes,
		setSelectedTypes,
		priceRange,
		setPriceRange,
		minRating,
		setMinRating,
		sortBy,
		setSortBy,
		sortOrder,
		setSortOrder,
		loadDestinations,
		filterAndSortDestinations,
		handleTypeChange,
		handlePriceChange,
		handleRatingChange,
		handleSortChange,
		toggleSortOrder,
		formatPrice,
		getTotalCost,
	};
};
