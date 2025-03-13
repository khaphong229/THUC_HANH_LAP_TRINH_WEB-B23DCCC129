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
  Table,
  Tabs,
  Spin
} from 'antd';
import { UserOutlined, StarOutlined, CommentOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// API URLs - Using mock API endpoints from the image
const API_BASE_URL = 'https://67d2555490e0670699bd1bc8.mockapi.io/Review'; // Replace with your actual API URL

// Interface for review from API based on schema from Image 1
interface ApiReview {
  id: string;
  createdAt: number; // Date type in schema
  name: string;      // String type in schema
  rate: number;      // Number type in schema
  response?: string; // String type in schema
  employeeId: number; // Number type in schema
}

// Interface for detailed rating
interface DetailedRating {
  service: number;
  attitude: number;
  cleanliness: number;
  price: number;
  overall: number;
}

// Interface for extended review (including detailed information)
interface ExtendedReview {
  id: string;
  appointmentId?: string;
  customerId?: string;
  customerName: string;
  employeeId: number;
  employeeName?: string;
  serviceId?: string;
  serviceName?: string;
  rating: DetailedRating;
  comment: string;
  date: string;
  reply?: string;
  replyDate?: string;
  createdAt: number;
}

// Interface for employee
interface Employee {
  id: number;
  name: string;
  position?: string;
  avatar?: string;
  averageRating?: number;
  reviewCount?: number;
}

const DanhGia: React.FC = () => {
  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ExtendedReview | null>(null);
  const [form] = Form.useForm();
  const [replyForm] = Form.useForm();
  const [filterType, setFilterType] = useState<string>('all');
  const [sortType, setSortType] = useState<string>('newest');
  const [ratingStats, setRatingStats] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    fetchAllData();
  }, []);

  // Update statistics when reviews change
  useEffect(() => {
    calculateRatingStats();
    calculateEmployeeRatings();
  }, [reviews]);

  // Load all necessary data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch reviews from mock API endpoint: GET /review
      const reviewsResponse = await axios.get(`${API_BASE_URL}/review`);
      
      // Load employee list, services, and appointments from localStorage temporarily
      // In the future, you could switch to using APIs for employees and services
      const storedEmployees = localStorage.getItem('booking-app-employees');
      const storedServices = localStorage.getItem('booking-app-services');
      const storedAppointments = localStorage.getItem('appointments');
      
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      } else {
        // Mock employee data if not in localStorage
        const mockEmployees: Employee[] = [
          { id: 1, name: 'Nguyễn Văn A', position: 'Stylist' },
          { id: 2, name: 'Trần Thị B', position: 'Nail Artist' },
          { id: 3, name: 'Lê Văn C', position: 'Hair Stylist' }
        ];
        setEmployees(mockEmployees);
        localStorage.setItem('booking-app-employees', JSON.stringify(mockEmployees));
      }
      
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      } else {
        // Mock service data if not in localStorage
        const mockServices = [
          { id: 1, name: 'Cắt tóc', price: 100000 },
          { id: 2, name: 'Làm móng', price: 150000 },
          { id: 3, name: 'Massage', price: 200000 }
        ];
        setServices(mockServices);
        localStorage.setItem('booking-app-services', JSON.stringify(mockServices));
      }
      
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        // Mock appointment data if not in localStorage
        const mockAppointments = [
          { 
            id: '1', 
            customerName: 'Khách hàng A', 
            service: 'Cắt tóc', 
            employee: 'Nguyễn Văn A', 
            date: new Date().toISOString(), 
            time: '10:00', 
            status: 'Hoàn thành' 
          },
          { 
            id: '2', 
            customerName: 'Khách hàng B', 
            service: 'Làm móng', 
            employee: 'Trần Thị B', 
            date: new Date().toISOString(), 
            time: '14:00', 
            status: 'Hoàn thành' 
          }
        ];
        setAppointments(mockAppointments);
        localStorage.setItem('appointments', JSON.stringify(mockAppointments));
      }
      
      // Convert API data to extended format
      const extendedReviews = convertApiReviewsToExtended(reviewsResponse.data);
      setReviews(extendedReviews);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      
      // Use mock data if API fails
      const mockApiReviews: ApiReview[] = [
        { id: '1', createdAt: Math.floor(Date.now()/1000) - 86400, name: 'Khách hàng A', rate: 80, response: 'Dịch vụ rất tốt!', employeeId: 1 },
        { id: '2', createdAt: Math.floor(Date.now()/1000) - 172800, name: 'Khách hàng B', rate: 90, response: 'Nhân viên phục vụ tận tình.', employeeId: 2 }
      ];
      
      const extendedReviews = convertApiReviewsToExtended(mockApiReviews);
      setReviews(extendedReviews);
    } finally {
      setLoading(false);
    }
  };

  // Convert API data to extended format
  const convertApiReviewsToExtended = (apiReviews: ApiReview[]): ExtendedReview[] => {
    return apiReviews.map(review => {
      const employee = employees.find(emp => emp.id === review.employeeId);
      
      // Create detailed rating from overall rating
      const ratingValue = review.rate / 20; // Convert from 0-100 scale to 0-5 scale
      
      return {
        id: review.id,
        customerName: review.name,
        employeeId: review.employeeId,
        employeeName: employee?.name || 'Chưa xác định',
        rating: {
          service: ratingValue,
          attitude: ratingValue,
          cleanliness: ratingValue,
          price: ratingValue,
          overall: ratingValue
        },
        comment: review.response || '',
        date: moment(review.createdAt * 1000).format('DD/MM/YYYY HH:mm'),
        createdAt: review.createdAt
      } as ExtendedReview;
    });
  };

  // Calculate rating statistics
  const calculateRatingStats = () => {
    const stats: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    reviews.forEach(review => {
      const rating = Math.round(review.rating.overall);
      if (rating >= 1 && rating <= 5) {
        stats[rating]++;
      }
    });
    
    setRatingStats(stats);
  };

  // Calculate average rating for each employee
  const calculateEmployeeRatings = () => {
    if (employees.length > 0 && reviews.length > 0) {
      const updatedEmployees = employees.map(employee => {
        const employeeReviews = reviews.filter(review => review.employeeId === employee.id);
        const averageRating = employeeReviews.length > 0
          ? employeeReviews.reduce((acc, curr) => acc + curr.rating.overall, 0) / employeeReviews.length
          : 0;
        
        return { 
          ...employee, 
          averageRating, 
          reviewCount: employeeReviews.length 
        };
      });
      
      setEmployees(updatedEmployees);
    }
  };

  // Get completed appointments that have not been reviewed
  const getUnreviewedAppointments = () => {
    return appointments.filter(appointment => 
      appointment.status === 'Hoàn thành' &&
      !reviews.some(review => review.appointmentId === appointment.id)
    );
  };

  // Handle new review submission
  const handleSubmitReview = async (values: any) => {
    try {
      const overallRating = (values.serviceRating + values.attitudeRating + values.cleanlinessRating + values.priceRating) / 4;
      
      const newReview = {
        name: selectedAppointment.customerName,
        rate: Math.round(overallRating * 20), // Convert from 0-5 scale to 0-100 scale
        response: values.comment,
        employeeId: employees.find(emp => emp.name === selectedAppointment.employee)?.id || 0,
        createdAt: Math.floor(Date.now() / 1000)
      };
      
      // Send new review to API - POST /review
      const response = await axios.post(`${API_BASE_URL}/review`, newReview);
      
      // Update state with new review
      const createdReview = response.data;
      const employee = employees.find(emp => emp.id === createdReview.employeeId);
      
      const newExtendedReview: ExtendedReview = {
        id: createdReview.id,
        appointmentId: selectedAppointment.id,
        customerName: createdReview.name,
        employeeId: createdReview.employeeId,
        employeeName: employee?.name || 'Chưa xác định',
        serviceName: selectedAppointment.service,
        rating: {
          service: values.serviceRating,
          attitude: values.attitudeRating,
          cleanliness: values.cleanlinessRating,
          price: values.priceRating,
          overall: overallRating
        },
        comment: values.comment,
        date: moment(createdReview.createdAt * 1000).format('DD/MM/YYYY HH:mm'),
        createdAt: createdReview.createdAt
      };
      
      setReviews([...reviews, newExtendedReview]);
      message.success('Đánh giá của bạn đã được gửi thành công!');
      setIsModalVisible(false);
      form.resetFields();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      message.error('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    }
  };

  // Handle reply submission
  const handleSubmitReply = async (values: any) => {
    if (!selectedReview) return;
    
    try {
      // Update review with new reply - PUT /review/:id
      const updatedReview = {
        id: selectedReview.id,
        name: selectedReview.customerName,
        rate: Math.round(selectedReview.rating.overall * 20), // Convert from 0-5 scale to 0-100 scale
        response: selectedReview.comment,
        employeeId: selectedReview.employeeId,
        createdAt: selectedReview.createdAt,
        reply: values.reply
      };
      
      await axios.put(`${API_BASE_URL}/review/${selectedReview.id}`, updatedReview);
      
      // Update state with new reply
      const updatedReviews = reviews.map(review => 
        review.id === selectedReview.id
          ? {
              ...review,
              reply: values.reply,
              replyDate: moment().format('DD/MM/YYYY HH:mm'),
            }
          : review
      );
      
      setReviews(updatedReviews);
      message.success('Phản hồi đã được gửi thành công!');
      setReplyModalVisible(false);
      replyForm.resetFields();
      
    } catch (error) {
      console.error('Error submitting reply:', error);
      message.error('Không thể gửi phản hồi. Vui lòng thử lại sau.');
    }
  };

  // Show review modal
  const showReviewModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalVisible(true);
  };

  // Show reply modal
  const showReplyModal = (review: ExtendedReview) => {
    setSelectedReview(review);
    setReplyModalVisible(true);
  };

  // Filter and sort reviews
  const getFilteredAndSortedReviews = () => {
    let filtered = [...reviews];

    // Filter by rating type
    if (filterType !== 'all') {
      const rating = parseInt(filterType);
      filtered = filtered.filter(review => 
        Math.round(review.rating.overall) === rating
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortType === 'newest') {
        return b.createdAt - a.createdAt;
      } else if (sortType === 'oldest') {
        return a.createdAt - b.createdAt;
      } else if (sortType === 'highest') {
        return b.rating.overall - a.rating.overall;
      } else {
        return a.rating.overall - b.rating.overall;
      }
    });

    return filtered;
  };

  // Calculate total reviews
  const getTotalReviews = () => {
    return Object.values(ratingStats).reduce((a, b) => a + b, 0);
  };

  // Calculate average rating
  const getAverageRating = () => {
    const total = getTotalReviews();
    if (total === 0) return 0;
    
    return Object.entries(ratingStats).reduce((acc, [rating, count]) => {
      return acc + (parseInt(rating) * count);
    }, 0) / total;
  };

  // Columns for employee rating table
  const employeeColumns = [
    {
      title: 'Nhân viên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Employee) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Điểm trung bình',
      dataIndex: 'averageRating',
      key: 'averageRating',
      sorter: (a: Employee, b: Employee) => (a.averageRating || 0) - (b.averageRating || 0),
      render: (rating: number) => (
        <Space>
          <Rate disabled allowHalf value={rating} />
          <Text>{rating ? rating.toFixed(1) : 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Số lượng đánh giá',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      sorter: (a: Employee, b: Employee) => (a.reviewCount || 0) - (b.reviewCount || 0),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        Đánh Giá Dịch Vụ & Nhân Viên
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thống Kê Đánh Giá" key="1">
            {/* Rating statistics */}
            <Card style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Tổng số đánh giá"
                      value={getTotalReviews()}
                      suffix="đánh giá"
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Điểm trung bình"
                      value={getAverageRating()}
                      precision={1}
                      suffix={<Rate disabled defaultValue={1} count={1} />}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Title level={5}>Phân bố đánh giá</Title>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <Row key={rating} align="middle" style={{ marginBottom: 8 }}>
                        <Col span={3}>
                          {rating} <StarOutlined style={{ color: '#fadb14' }} />
                        </Col>
                        <Col span={16}>
                          <Progress 
                            percent={getTotalReviews() ? (ratingStats[rating] / getTotalReviews() * 100) : 0} 
                            size="small" 
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

            {/* Employee ratings */}
            <Card title="Đánh Giá Nhân Viên" style={{ marginBottom: '24px' }}>
              <Table 
                dataSource={employees.filter(emp => emp.reviewCount && emp.reviewCount > 0)} 
                columns={employeeColumns} 
                rowKey="id"
                pagination={false}
              />
            </Card>
          </TabPane>

          <TabPane tab="Đánh Giá & Phản Hồi" key="2">
            {/* Unreviewed appointments section */}
            <Card title="Lịch Hẹn Chưa Đánh Giá" style={{ marginBottom: '24px' }}>
              {getUnreviewedAppointments().length > 0 ? (
                <List
                  dataSource={getUnreviewedAppointments()}
                  renderItem={appointment => (
                    <List.Item
                      actions={[
                        <Button 
                          type="primary" 
                          icon={<StarOutlined />}
                          onClick={() => showReviewModal(appointment)}
                        >
                          Đánh giá
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={`Dịch vụ: ${appointment.service}`}
                        description={
                          <>
                            <Text>Nhân viên: {appointment.employee}</Text>
                            <br />
                            <Text type="secondary">
                              Ngày: {moment(appointment.date).format('DD/MM/YYYY')} - 
                              Giờ: {appointment.time}
                            </Text>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="Không có lịch hẹn nào cần đánh giá" />
              )}
            </Card>

            {/* Reviews display section */}
            <Card 
              title="Đánh Giá Gần Đây"
              extra={
                <Space>
                  <Select
                    value={filterType}
                    onChange={setFilterType}
                    style={{ width: 120 }}
                    placeholder="Lọc đánh giá"
                  >
                    <Option value="all">Tất cả</Option>
                    <Option value="5">5 sao</Option>
                    <Option value="4">4 sao</Option>
                    <Option value="3">3 sao</Option>
                    <Option value="2">2 sao</Option>
                    <Option value="1">1 sao</Option>
                  </Select>
                  <Select
                    value={sortType}
                    onChange={setSortType}
                    style={{ width: 150 }}
                    placeholder="Sắp xếp"
                  >
                    <Option value="newest">Mới nhất</Option>
                    <Option value="oldest">Cũ nhất</Option>
                    <Option value="highest">Đánh giá cao nhất</Option>
                    <Option value="lowest">Đánh giá thấp nhất</Option>
                  </Select>
                </Space>
              }
            >
              {getFilteredAndSortedReviews().length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={getFilteredAndSortedReviews()}
                  renderItem={review => (
                    <List.Item>
                      <Comment
                        author={<Text strong>{review.customerName}</Text>}
                        avatar={<Avatar icon={<UserOutlined />} />}
                        content={
                          <>
                            <Space direction="vertical" style={{ width: '100%' }}>
                              <Space>
                                <Text>Tổng thể:</Text>
                                <Rate disabled defaultValue={review.rating.overall} />
                                <Text>({review.rating.overall.toFixed(1)})</Text>
                              </Space>
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
                              <Paragraph style={{ margin: '8px 0' }}>
                                {review.comment}
                              </Paragraph>
                              {review.serviceName && (
                                <Space>
                                  <Tag color="blue">{review.serviceName}</Tag>
                                  <Tag color="green">Nhân viên: {review.employeeName}</Tag>
                                </Space>
                              )}
                            </Space>
                          </>
                        }
                        datetime={review.date}
                      />
                      
                      {/* Employee reply section */}
                      {review.reply && (
                        <Comment
                          style={{ marginLeft: 44 }}
                          author={<Text strong>{review.employeeName} (Nhân viên)</Text>}
                          avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                          content={review.reply}
                          datetime={review.replyDate}
                        />
                      )}
                      
                      {/* Reply button for employees */}
                      {!review.reply && (
                        <Button
                          type="link"
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
              ) : (
                <Empty description="Chưa có đánh giá nào" />
              )}
            </Card>
          </TabPane>
        </Tabs>
      )}

      {/* Review modal */}
      <Modal
        title="Đánh Giá Dịch Vụ & Nhân Viên"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} onFinish={handleSubmitReview} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceRating"
                label="Chất lượng dịch vụ"
                rules={[{ required: true, message: 'Vui lòng đánh giá chất lượng dịch vụ!' }]}
              >
                <Rate />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="attitudeRating"
                label="Thái độ phục vụ"
                rules={[{ required: true, message: 'Vui lòng đánh giá thái độ phục vụ!' }]}
              >
                <Rate />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cleanlinessRating"
                label="Vệ sinh sạch sẽ"
                rules={[{ required: true, message: 'Vui lòng đánh giá vệ sinh!' }]}
              >
                <Rate />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priceRating"
                label="Giá cả hợp lý"
                rules={[{ required: true, message: 'Vui lòng đánh giá giá cả!' }]}
              >
                <Rate />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="comment"
            label="Nhận xét"
            rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
          >
            <TextArea rows={4} placeholder="Nhập nhận xét của bạn..." />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Gửi đánh giá
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Reply modal */}
      <Modal
        title="Phản Hồi Đánh Giá"
        visible={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        footer={null}
      >
        <Form form={replyForm} onFinish={handleSubmitReply} layout="vertical">
          <Form.Item
            name="reply"
            label="Phản hồi"
            rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}
          >
            <TextArea rows={4} placeholder="Nhập phản hồi của bạn..." />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setReplyModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Gửi phản hồi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DanhGia;