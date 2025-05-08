import React, { useEffect, useState } from 'react';
import { Card, List, Button, DatePicker, Input, Form, Select, Tag, Empty, Spin, Modal, message, Typography, Space, Alert, Radio } from 'antd';
import { DeleteOutlined, PlusOutlined, CalendarOutlined, EditOutlined, SaveOutlined, SortAscendingOutlined } from '@ant-design/icons';
import useLichTrinh from '@/models/lichTrinh';
import { Destination, Itinerary, ItineraryItem } from '@/services/KeHoachDuLich/LichTrinh/typings';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DestinationCard, BudgetSummary } from './components';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { Group: RadioGroup, Button: RadioButton } = Radio;
const { RangePicker } = DatePicker;

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result.map((item, index) => ({
		...item,
		order: index + 1,
	}));
};


const getDaysBetweenDates = (startDate: string, endDate: string): number => {
	const start = dayjs(startDate);
	const end = dayjs(endDate);
	return end.diff(start, 'day') + 1; 
};


const generateDaysArray = (startDate: string, endDate: string): { value: number, label: string }[] => {
	const numDays = getDaysBetweenDates(startDate, endDate);
	const daysArray = [];
	
	for (let i = 1; i <= numDays; i++) {
		const date = dayjs(startDate).add(i - 1, 'day');
		daysArray.push({
			value: i,
			label: `Ngày ${i} (${date.format('DD/MM/YYYY')})`
		});
	}
	
	return daysArray;
};

const LichTrinhPage: React.FC = () => {
	const {
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
		sortItineraryByDay
	} = useLichTrinh();

	const [form] = Form.useForm();
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

	useEffect(() => {
		const loadData = async () => {
			try {
				setError(null);
				await fetchDestinations();
				await fetchItineraries();
			} catch (err) {
				setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
				console.error('Error loading data:', err);
			}
		};
		
		loadData();
	}, []);

	
	useEffect(() => {
		if (itineraries.length > 0) {
			const sorted = [...itineraries];
			
			switch (sortType) {
				case 'date-asc':
					sorted.sort((a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf());
					break;
				case 'date-desc':
					sorted.sort((a, b) => dayjs(b.startDate).valueOf() - dayjs(a.startDate).valueOf());
					break;
				case 'name-asc':
					sorted.sort((a, b) => a.name.localeCompare(b.name));
					break;
				case 'name-desc':
					sorted.sort((a, b) => b.name.localeCompare(a.name));
					break;
				default:
					sorted.sort((a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf());
			}
			
			setSortedItineraries(sorted);
		} else {
			setSortedItineraries([]);
		}
	}, [itineraries, sortType]);

	useEffect(() => {
		if (currentItinerary) {
			try {
			
				const sorted = sortItineraryByDay(currentItinerary);
				setSortedItems(sorted.items);
				
		
				const items = sorted.items.filter(item => item.day === currentDay) || [];
				setDestinationsForDay(items);

				const budgetDetails = calculateItineraryDetails(currentItinerary, destinations);
				setBudgetData(budgetDetails);
			} catch (err) {
				console.error('Error processing itinerary data:', err);
			}
		}
	}, [currentItinerary, currentDay, destinations]);

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
			dateRange: [
				dayjs(currentItinerary.startDate),
				dayjs(currentItinerary.endDate || currentItinerary.startDate)
			],
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

			const exists = destinationsForDay.some(item => item.destinationId === selectedDestination);
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
				item => !(item.day === currentDay && item.destinationId === destinationId)
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

			const updatedDestinationsForDay = reorder(
				destinationsForDay,
				result.source.index,
				result.destination.index
			);

			const otherItems = currentItinerary.items.filter(item => item.day !== currentDay);
			const allItems = [...otherItems, ...updatedDestinationsForDay];
			
			updateItineraryData(currentItinerary.id, { items: allItems });
		} catch (err) {
			message.error('Không thể cập nhật thứ tự. Vui lòng thử lại.');
			console.error('Error during drag and drop:', err);
		}
	};

	const renderDestinationCard = (item: ItineraryItem, index: number) => {
		const destination = destinations.find(d => d.id === item.destinationId);
		if (!destination) return null;

		return (
			<Draggable key={item.destinationId} draggableId={item.destinationId} index={index}>
				{(provided) => (
					<DestinationCard
						destination={destination}
						onDelete={handleRemoveDestination}
						innerRef={provided.innerRef}
						draggableProps={provided.draggableProps}
						dragHandleProps={provided.dragHandleProps}
					/>
				)}
			</Draggable>
		);
	};


	const getUniqueDays = () => {
		if (!currentItinerary) return [1];
		

		if (currentItinerary.startDate && currentItinerary.endDate) {
			const numDays = getDaysBetweenDates(currentItinerary.startDate, currentItinerary.endDate);
			return Array.from({ length: numDays }, (_, i) => i + 1);
		}
		
		if (sortedItems.length) {
			const days = sortedItems.map(item => item.day);
			const uniqueDays = [...new Set(days)].sort((a, b) => a - b);
			return uniqueDays.length > 0 ? uniqueDays : [1];
		}
		
		return [1];
	};

	const formatDate = (dateString: string) => {
		try {
			return dayjs(dateString).format('DD/MM/YYYY');
		} catch (error) {
			return dateString;
		}
	};


	const getNumberOfDays = (itinerary: Itinerary) => {
		if (itinerary.startDate && itinerary.endDate) {
			return getDaysBetweenDates(itinerary.startDate, itinerary.endDate);
		}
		return 1;
	};

	
	const getCurrentDayLabel = () => {
		if (!currentItinerary || !currentItinerary.startDate) return `Ngày ${currentDay}`;
		
		const date = dayjs(currentItinerary.startDate).add(currentDay - 1, 'day');
		return `Ngày ${currentDay} (${date.format('DD/MM/YYYY')})`;
	};


	const getDayOptions = () => {
		if (!currentItinerary) return [];
		
		if (currentItinerary.startDate && currentItinerary.endDate) {
			return generateDaysArray(currentItinerary.startDate, currentItinerary.endDate);
		}
		
		return getUniqueDays().map(day => ({
			value: day, 
			label: `Ngày ${day}`
		}));
	};

	return (
		<div style={{ padding: '24px' }}>
			<Title level={2}>Lịch trình du lịch</Title>
			
			{error && (
				<Alert
					message="Lỗi"
					description={error}
					type="error"
					style={{ marginBottom: 16 }}
					closable
					onClose={() => setError(null)}
				/>
			)}
			
			<div style={{ display: 'flex', gap: '24px' }}>
		
				<div style={{ width: '300px' }}>
					<Card 
						title="Danh sách lịch trình"
						extra={
							<Button 
								type="primary" 
								icon={<PlusOutlined />} 
								onClick={() => setIsModalOpen(true)}
							>
								Tạo mới
							</Button>
						}
					>
		
						<div style={{ marginBottom: 16 }}>
							<Space direction="vertical" style={{ width: '100%' }}>
								<Text strong><SortAscendingOutlined /> Sắp xếp theo:</Text>
								<RadioGroup 
									options={[
										{ label: 'Ngày ↑', value: 'date-asc' },
										{ label: 'Ngày ↓', value: 'date-desc' },
										{ label: 'Tên A-Z', value: 'name-asc' },
										{ label: 'Tên Z-A', value: 'name-desc' },
									]} 
									onChange={(e) => setSortType(e.target.value)}
									value={sortType}
									optionType="button"
									buttonStyle="solid"
									size="small"
									style={{ width: '100%', display: 'flex' }}
								/>
							</Space>
						</div>
						
						{loading ? (
							<div style={{ textAlign: 'center', padding: '20px' }}>
								<Spin />
							</div>
						) : (
							<>
								{sortedItineraries.length === 0 ? (
									<Empty description="Chưa có lịch trình nào" />
								) : (
									<List
										dataSource={sortedItineraries}
										renderItem={(item) => (
											<List.Item
												actions={[
													<Button 
														icon={<DeleteOutlined />} 
														size="small" 
														danger
														onClick={() => removeItinerary(item.id)}
													/>
												]}
											>
												<List.Item.Meta
													title={
														<a 
															onClick={() => {
																setCurrentItinerary(item);
																setCurrentDay(1);
																setEditMode(true);
															}}
														>
															{item.name}
														</a>
													}
													description={
														<>
															<div>Bắt đầu: {formatDate(item.startDate)}</div>
															{item.endDate && <div>Kết thúc: {formatDate(item.endDate)}</div>}
															<div>Số ngày: {getNumberOfDays(item)}</div>
														</>
													}
												/>
											</List.Item>
										)}
									/>
								)}
							</>
						)}
					</Card>
					
					{/* Danh sách ngày trong lịch trình */}
					{currentItinerary && sortedItems.length > 0 && (
						<Card 
							title="Tóm tắt lịch trình theo ngày" 
							style={{ marginTop: 16 }}
							size="small"
						>
							<List
								size="small"
								dataSource={getUniqueDays()}
								renderItem={(day) => {
									const dayItems = sortedItems.filter(item => item.day === day);
									const dayDestinations = dayItems.map(item => 
										destinations.find(d => d.id === item.destinationId)?.name
									).filter(Boolean);
									
							
									const actualDate = currentItinerary.startDate ? 
										dayjs(currentItinerary.startDate).add(day - 1, 'day').format('DD/MM/YYYY') : '';
									
									return (
										<List.Item 
											onClick={() => setCurrentDay(day)}
											style={{ 
												cursor: 'pointer',
												background: day === currentDay ? '#e6f7ff' : 'transparent'
											}}
										>
											<div style={{ width: '100%' }}>
												<strong>Ngày {day}</strong>
												{actualDate && <small style={{ marginLeft: 8 }}>({actualDate})</small>}
												<div style={{ fontSize: '12px' }}>
													{dayDestinations.length > 0 
														? dayDestinations.join(', ') 
														: 'Chưa có điểm đến'}
												</div>
											</div>
										</List.Item>
									);
								}}
							/>
						</Card>
					)}
				</div>
				

				<div style={{ flex: 1 }}>
					{editMode && currentItinerary ? (
						<div>
							<Card 
								title={
									<Space>
										<CalendarOutlined />
										<span>{currentItinerary.name}</span>
									</Space>
								}
								extra={
									<Space>
										<Text>
											{currentItinerary.startDate && `Từ: ${formatDate(currentItinerary.startDate)}`}
											{currentItinerary.endDate && ` - Đến: ${formatDate(currentItinerary.endDate)}`}
										</Text>
										<Button 
											icon={<EditOutlined />} 
											onClick={handleEditItinerary}
										>
											Sửa thông tin
										</Button>
									</Space>
								}
							>
								<div style={{ display: 'flex', marginBottom: 16 }}>
									<div style={{ marginRight: 16 }}>
										<span style={{ marginRight: 8 }}>Ngày:</span>
										<Select 
											value={currentDay} 
											onChange={setCurrentDay}
											style={{ width: 200 }}
										>
											{getDayOptions().map(day => (
												<Option key={day.value} value={day.value}>
													{day.label}
												</Option>
											))}
										</Select>
									</div>
									
									<div style={{ display: 'flex', flex: 1 }}>
										<Select
											placeholder="Chọn điểm đến"
											style={{ flex: 1, marginRight: 8 }}
											value={selectedDestination}
											onChange={setSelectedDestination}
										>
											{destinations.map(dest => (
												<Option key={dest.id} value={dest.id}>
													{dest.name} - {dest.location}
												</Option>
											))}
										</Select>
										<Button 
											type="primary" 
											icon={<PlusOutlined />} 
											onClick={handleAddDestination}
										>
											Thêm
										</Button>
									</div>
								</div>
								
								<DragDropContext onDragEnd={onDragEnd}>
									<Droppable droppableId="destinations">
										{(provided) => (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												style={{ minHeight: '200px' }}
											>
												{destinationsForDay.length === 0 ? (
													<Empty description="Chưa có điểm đến nào cho ngày này" />
												) : (
													destinationsForDay.map((item, index) => renderDestinationCard(item, index))
												)}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</DragDropContext>
							</Card>
							
							{budgetData && (
								<BudgetSummary 
									budget={budgetData.budget}
									duration={budgetData.duration}
									totalBudget={currentItinerary.totalBudget}
									travelDistance={budgetData.travelDistance}
								/>
							)}
						</div>
					) : (
						<Card>
							<Empty 
								description="Chọn một lịch trình hoặc tạo lịch trình mới để bắt đầu" 
								image={Empty.PRESENTED_IMAGE_SIMPLE} 
							/>
						</Card>
					)}
				</div>
			</div>
			
			<Modal
				title="Tạo lịch trình mới"
				visible={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={null}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleCreateItinerary}
				>
					<Form.Item
						name="name"
						label="Tên lịch trình"
						rules={[{ required: true, message: 'Vui lòng nhập tên lịch trình' }]}
					>
						<Input placeholder="Nhập tên lịch trình" />
					</Form.Item>
					
					<Form.Item
						name="dateRange"
						label="Thời gian"
						rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
					>
						<RangePicker 
							style={{ width: '100%' }} 
							format="DD/MM/YYYY"
							placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
						/>
					</Form.Item>
					
					<Form.Item
						name="totalBudget"
						label="Ngân sách dự kiến (VND)"
					>
						<Input type="number" placeholder="Nhập ngân sách dự kiến (nếu có)" />
					</Form.Item>
					
					<Form.Item>
						<Button type="primary" htmlType="submit" icon={<SaveOutlined />} block>
							Tạo lịch trình
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title="Chỉnh sửa lịch trình"
				visible={isEditModalOpen}
				onCancel={() => setIsEditModalOpen(false)}
				footer={null}
			>
				<Form
					form={editForm}
					layout="vertical"
					onFinish={handleUpdateItinerary}
				>
					<Form.Item
						name="name"
						label="Tên lịch trình"
						rules={[{ required: true, message: 'Vui lòng nhập tên lịch trình' }]}
					>
						<Input placeholder="Nhập tên lịch trình" />
					</Form.Item>
					
					<Form.Item
						name="dateRange"
						label="Thời gian"
						rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
					>
						<RangePicker 
							style={{ width: '100%' }} 
							format="DD/MM/YYYY"
							placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
						/>
					</Form.Item>
					
					<Form.Item
						name="totalBudget"
						label="Ngân sách dự kiến (VND)"
					>
						<Input type="number" placeholder="Nhập ngân sách dự kiến (nếu có)" />
					</Form.Item>
					
					<Form.Item>
						<Button type="primary" htmlType="submit" icon={<SaveOutlined />} block>
							Cập nhật lịch trình
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default LichTrinhPage;
