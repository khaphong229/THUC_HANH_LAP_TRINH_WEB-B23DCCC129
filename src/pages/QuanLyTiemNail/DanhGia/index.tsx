import React, { useState, useEffect } from 'react';
import {
	Card,
	Rate,
	Input,
	Button,
	List,
	Typography,
	Space,
	Avatar,
	Divider,
	Tag,
	message,
	Modal,
	Form,
	Empty,
	Comment,
	Select,
	Row,
	Col,
	Statistic,
	Progress,
	Pagination,
} from 'antd';
import { UserOutlined, StarOutlined, CommentOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface DetailedRating {
	service: number;
	attitude: number;
	cleanliness: number;
	price: number;
	overall: number;
}

interface Review {
	id: string;
	appointmentId?: string;
	customerId?: string;
	customerName: string;
	employeeId: string;
	employeeName?: string;
	serviceId?: string;
	serviceName?: string;
	rating?: DetailedRating;
	rate?: number;
	comment?: string;
	response?: string;
	date?: string;
	createdAt?: number;
	replyDate?: string;
	name?: string;
}

interface Service {
	id: string;
	name: string;
	cost: string;
	process_time: string;
	user_review: boolean;
	employee_id: string;
}

const REVIEW_API_URL = 'https://67d2555490e0670699bd1bc8.mockapi.io/Review/review';
const SERVICE_API_URL = 'https://67d23b2f90e0670699bcba98.mockapi.io/api/v1/tiem-nail/dich-vu';

const DanhGia: React.FC = () => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [unreviewedServices, setUnreviewedServices] = useState<Service[]>([]);
	const [employees, setEmployees] = useState<any[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [replyModalVisible, setReplyModalVisible] = useState(false);
	const [selectedReview, setSelectedReview] = useState<Review | null>(null);
	const [form] = Form.useForm();
	const [replyForm] = Form.useForm();
	const [filterType, setFilterType] = useState<string>('all');
	const [sortType, setSortType] = useState<string>('newest');
	const [ratingStats, setRatingStats] = useState<Record<number, number>>({
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
	});
	const [loading, setLoading] = useState(true);

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		calculateRatingStats();
	}, [reviews]);

	const calculateRatingStats = () => {
		if (reviews.length > 0) {
			const stats: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
			reviews.forEach((review) => {
				const rating = getNormalizedRatingValue(review);
				if (rating >= 1 && rating <= 5) {
					stats[Math.round(rating)]++;
				}
			});
			setRatingStats(stats);
		}
	};

	const loadData = async () => {
		setLoading(true);
		try {
			const [reviewsResponse, servicesResponse] = await Promise.all([
				axios.get(REVIEW_API_URL),
				axios.get(SERVICE_API_URL),
			]);

			setReviews(reviewsResponse.data);

			const unreviewedServicesData = servicesResponse.data.filter((service: Service) => !service.user_review);
			setUnreviewedServices(unreviewedServicesData);

			const storedEmployees = localStorage.getItem('booking-app-employees');
			if (storedEmployees) {
				setEmployees(JSON.parse(storedEmployees));
			}
		} catch (error) {
			console.error('Error loading data:', error);
			message.error('Đã xảy ra lỗi khi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmitReview = async (values: any) => {
		if (!selectedService) return;

		try {
			const overall =
				(values.serviceRating + values.attitudeRating + values.cleanlinessRating + values.priceRating) / 4;

			const employee = employees.find((emp) => emp.id === selectedService.employee_id);
			const employeeName = employee ? employee.name : 'Nhân viên';

			const newReview = {
				id: Date.now().toString(),
				rate: Math.round(overall * 20),
				comment: values.comment,
				employeeId: selectedService.employee_id,
				employeeName: employeeName,
				customerName: values.customerName,
				serviceName: selectedService.name,
				serviceId: selectedService.id,
				createdAt: Math.floor(Date.now() / 1000),
				rating: {
					service: values.serviceRating,
					attitude: values.attitudeRating,
					cleanliness: values.cleanlinessRating,
					price: values.priceRating,
					overall: overall,
				},
			};

			const response = await axios.post(REVIEW_API_URL, newReview);

			await axios.put(`${SERVICE_API_URL}/${selectedService.id}`, {
				...selectedService,
				user_review: true,
			});

			setReviews((prevReviews) => [...prevReviews, response.data]);
			setUnreviewedServices((prevServices) => prevServices.filter((service) => service.id !== selectedService.id));

			message.success('Đánh giá của bạn đã được gửi thành công!');
			setIsModalVisible(false);
			form.resetFields();

			loadData();
		} catch (error) {
			console.error('Error submitting review:', error.response?.data || error.message);
			message.error('Đã xảy ra lỗi khi gửi đánh giá: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
		}
	};

	// Submit a reply to a review
	const handleSubmitReply = async (values: any) => {
		if (!selectedReview) return;

		try {
			const employee = employees.find((emp) => emp.id === selectedReview.employeeId);
			const employeeName = employee ? employee.name : 'Nhân viên';

			const updatedReview = {
				...selectedReview,
				response: values.reply,
				replyDate: new Date().toISOString(),
				employeeName: employeeName,
			};

			await axios.put(`${REVIEW_API_URL}/${selectedReview.id}`, updatedReview);

			setReviews((prevReviews) =>
				prevReviews.map((review) => (review.id === selectedReview.id ? updatedReview : review)),
			);

			message.success('Phản hồi đã được gửi thành công!');
			setReplyModalVisible(false);
			replyForm.resetFields();
		} catch (error) {
			console.error('Error submitting reply:', error);
			message.error('Đã xảy ra lỗi khi gửi phản hồi');
		}
	};

	const showReviewModal = (service: Service) => {
		setSelectedService(service);
		setIsModalVisible(true);
		form.resetFields();
	};

	const showReplyModal = (review: Review) => {
		setSelectedReview(review);
		setReplyModalVisible(true);
		replyForm.resetFields(); // Reset form when opening
	};

	const getNormalizedRatingValue = (review: Review): number => {
		if (review.rating?.overall !== undefined) {
			return review.rating.overall;
		}
		if (review.rate !== undefined) {
			return review.rate / 20;
		}
		return 0;
	};

	const getFilteredAndSortedReviews = () => {
		let filtered = [...reviews];

		if (filterType !== 'all') {
			const rating = parseInt(filterType);
			filtered = filtered.filter((review) => {
				const normalizedRating = getNormalizedRatingValue(review);
				return Math.round(normalizedRating) === rating;
			});
		}

		filtered.sort((a, b) => {
			const dateA = a.createdAt || moment(a.date).unix();
			const dateB = b.createdAt || moment(b.date).unix();

			const ratingA = getNormalizedRatingValue(a);
			const ratingB = getNormalizedRatingValue(b);

			switch (sortType) {
				case 'newest':
					return dateB - dateA;
				case 'oldest':
					return dateA - dateB;
				case 'highest':
					return ratingB - ratingA;
				case 'lowest':
					return ratingA - ratingB;
				default:
					return dateB - dateA;
			}
		});

		return filtered;
	};

	const getPaginatedReviews = () => {
		const filteredAndSorted = getFilteredAndSortedReviews();
		const startIndex = (currentPage - 1) * pageSize;
		return filteredAndSorted.slice(startIndex, startIndex + pageSize);
	};

	const handlePageChange = (page: number, newPageSize?: number) => {
		setCurrentPage(page);
		if (newPageSize) setPageSize(newPageSize);
	};

	const getTotalReviews = () => {
		return Object.values(ratingStats).reduce((a, b) => a + b, 0);
	};

	const getAverageRating = () => {
		const total = getTotalReviews();
		if (total === 0) return 0;

		return (
			Object.entries(ratingStats).reduce((acc, [rating, count]) => {
				return acc + parseInt(rating) * count;
			}, 0) / total
		);
	};

	const formatDate = (date?: string | number) => {
		if (!date) return '';

		if (typeof date === 'number') {
			return moment.unix(date).format('DD/MM/YYYY HH:mm');
		}
		return moment(date).format('DD/MM/YYYY HH:mm');
	};

	const getEmployeeName = (employeeId: string) => {
		const employee = employees.find((emp) => emp.id === employeeId);
		return employee ? employee.name : 'Nhân viên';
	};

	return (
		<div style={{ padding: '24px' }}>
			<Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
				Đánh Giá Dịch Vụ & Nhân Viên
			</Title>

			<Card style={{ marginBottom: '24px' }}>
				<Row gutter={[16, 16]}>
					<Col span={8}>
						<Card>
							<Statistic title='Tổng số đánh giá' value={getTotalReviews()} suffix='đánh giá' loading={loading} />
						</Card>
					</Col>
					<Col span={8}>
						<Card>
							<Statistic
								title='Điểm trung bình'
								value={getAverageRating()}
								precision={1}
								suffix={<Rate disabled defaultValue={1} count={1} />}
								loading={loading}
							/>
						</Card>
					</Col>
					<Col span={8}>
						<Card>
							<Title level={5}>Phân bố đánh giá</Title>
							{[5, 4, 3, 2, 1].map((rating) => (
								<Row key={rating} align='middle' style={{ marginBottom: 8 }}>
									<Col span={3}>
										{rating} <StarOutlined style={{ color: '#fadb14' }} />
									</Col>
									<Col span={16}>
										<Progress
											percent={getTotalReviews() ? (ratingStats[rating] / getTotalReviews()) * 100 : 0}
											size='small'
											showInfo={false}
										/>
									</Col>
									<Col span={5} style={{ textAlign: 'right' }}>
										{ratingStats[rating]}
									</Col>
								</Row>
							))}
						</Card>
					</Col>
				</Row>
			</Card>

			<Card title='Dịch Vụ Chưa Đánh Giá' style={{ marginBottom: '24px' }} loading={loading}>
				{unreviewedServices.length > 0 ? (
					<List
						dataSource={unreviewedServices}
						renderItem={(service) => (
							<List.Item
								actions={[
									<Button type='primary' icon={<StarOutlined />} onClick={() => showReviewModal(service)}>
										Đánh giá
									</Button>,
								]}
							>
								<List.Item.Meta
									title={`Dịch vụ: ${service.name}`}
									description={
										<>
											<Text>Giá: {service.cost}</Text>
											<br />
											<Text type='secondary'>Thời gian thực hiện: {service.process_time}</Text>
										</>
									}
								/>
							</List.Item>
						)}
					/>
				) : (
					<Empty description='Không có dịch vụ nào cần đánh giá' />
				)}
			</Card>

			<Card
				title='Đánh Giá Gần Đây'
				extra={
					<Space>
						<Select
							value={filterType}
							onChange={(value) => {
								setFilterType(value);
								setCurrentPage(1); // Reset to first page when filter changes
							}}
							style={{ width: 120 }}
							placeholder='Lọc đánh giá'
						>
							<Option value='all'>Tất cả</Option>
							<Option value='5'>5 sao</Option>
							<Option value='4'>4 sao</Option>
							<Option value='3'>3 sao</Option>
							<Option value='2'>2 sao</Option>
							<Option value='1'>1 sao</Option>
						</Select>
						<Select
							value={sortType}
							onChange={(value) => {
								setSortType(value);
								setCurrentPage(1);
							}}
							style={{ width: 150 }}
							placeholder='Sắp xếp'
						>
							<Option value='newest'>Mới nhất</Option>
							<Option value='oldest'>Cũ nhất</Option>
							<Option value='highest'>Đánh giá cao nhất</Option>
							<Option value='lowest'>Đánh giá thấp nhất</Option>
						</Select>
					</Space>
				}
				loading={loading}
			>
				{getFilteredAndSortedReviews().length > 0 ? (
					<>
						<List
							itemLayout='vertical'
							dataSource={getPaginatedReviews()}
							renderItem={(review) => (
								<List.Item>
									<Comment
										author={<Text strong>{review.name || review.customerName}</Text>}
										avatar={<Avatar icon={<UserOutlined />} />}
										content={
											<>
												<Space direction='vertical' style={{ width: '100%' }}>
													<Space>
														<Text>Tổng thể:</Text>
														<Rate disabled value={getNormalizedRatingValue(review)} allowHalf />
														<Text>({getNormalizedRatingValue(review).toFixed(1)})</Text>
													</Space>

													{/* Display detailed ratings if available */}
													{review.rating && (
														<Row gutter={16}>
															<Col span={6}>
																<Text>Dịch vụ: {review.rating.service}</Text>
															</Col>
															<Col span={6}>
																<Text>Thái độ: {review.rating.attitude}</Text>
															</Col>
															<Col span={6}>
																<Text>Vệ sinh: {review.rating.cleanliness}</Text>
															</Col>
															<Col span={6}>
																<Text>Giá cả: {review.rating.price}</Text>
															</Col>
														</Row>
													)}

													<Paragraph style={{ margin: '8px 0' }}>{review.comment}</Paragraph>

													{/* Display service and employee tags if available */}
													<Space>
														{review.serviceName && <Tag color='blue'>{review.serviceName}</Tag>}
														{(review.employeeName || review.employeeId) && (
															<Tag color='green'>
																Nhân viên: {review.employeeName || getEmployeeName(review.employeeId)}
															</Tag>
														)}
													</Space>
												</Space>
											</>
										}
										datetime={formatDate(review.createdAt || review.date)}
									/>

									{/* Employee response */}
									{review.response && (
										<Comment
											style={{
												marginLeft: 44,
												background: '#f9f9f9',
												padding: '12px',
												borderRadius: '8px',
											}}
											author={
												<Space>
													<Text strong>{review.employeeName || getEmployeeName(review.employeeId)}</Text>
													<Tag color='blue'>Phản hồi từ nhân viên</Tag>
												</Space>
											}
											avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />}
											content={review.response}
											datetime={formatDate(review.replyDate)}
										/>
									)}

									{!review.response && (
										<Button
											type='link'
											icon={<CommentOutlined />}
											onClick={() => showReplyModal(review)}
											style={{ marginLeft: 44 }}
										>
											Phản hồi
										</Button>
									)}

									<Divider />
								</List.Item>
							)}
						/>

						<div style={{ textAlign: 'center', marginTop: '16px' }}>
							<Pagination
								current={currentPage}
								total={getFilteredAndSortedReviews().length}
								pageSize={pageSize}
								onChange={handlePageChange}
								showSizeChanger
								pageSizeOptions={['5', '10', '20']}
								showTotal={(total) => `Tổng cộng ${total} đánh giá`}
							/>
						</div>
					</>
				) : (
					<Empty description='Chưa có đánh giá nào' />
				)}
			</Card>

			<Modal
				title='Đánh Giá Dịch Vụ & Nhân Viên'
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={700}
			>
				{selectedService && (
					<Form form={form} onFinish={handleSubmitReview} layout='vertical'>
						<Form.Item
							name='customerName'
							label='Tên của bạn'
							rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
						>
							<Input placeholder='Nhập tên của bạn' />
						</Form.Item>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='serviceRating'
									label='Chất lượng dịch vụ'
									rules={[{ required: true, message: 'Vui lòng đánh giá chất lượng dịch vụ!' }]}
								>
									<Rate />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='attitudeRating'
									label='Thái độ phục vụ'
									rules={[{ required: true, message: 'Vui lòng đánh giá thái độ phục vụ!' }]}
								>
									<Rate />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='cleanlinessRating'
									label='Vệ sinh sạch sẽ'
									rules={[{ required: true, message: 'Vui lòng đánh giá vệ sinh!' }]}
								>
									<Rate />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='priceRating'
									label='Giá cả hợp lý'
									rules={[{ required: true, message: 'Vui lòng đánh giá giá cả!' }]}
								>
									<Rate />
								</Form.Item>
							</Col>
						</Row>

						<Form.Item name='comment' label='Nhận xét' rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}>
							<TextArea rows={4} placeholder='Nhập nhận xét của bạn...' />
						</Form.Item>

						<Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
							<Space>
								<Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
								<Button type='primary' htmlType='submit'>
									Gửi đánh giá
								</Button>
							</Space>
						</Form.Item>
					</Form>
				)}
			</Modal>

			<Modal
				title='Phản Hồi Đánh Giá'
				visible={replyModalVisible}
				onCancel={() => setReplyModalVisible(false)}
				footer={null}
			>
				{selectedReview && (
					<Form form={replyForm} onFinish={handleSubmitReply} layout='vertical'>
						<Form.Item name='reply' label='Phản hồi' rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}>
							<TextArea rows={4} placeholder='Nhập phản hồi của bạn...' />
						</Form.Item>

						<Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
							<Space>
								<Button onClick={() => setReplyModalVisible(false)}>Hủy</Button>
								<Button type='primary' htmlType='submit'>
									Gửi phản hồi
								</Button>
							</Space>
						</Form.Item>
					</Form>
				)}
			</Modal>
		</div>
	);
};

export default DanhGia;
