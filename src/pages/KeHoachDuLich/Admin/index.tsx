import { useEffect } from 'react';
import {
	Table,
	Button,
	Space,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	Upload,
	Rate,
	Tooltip,
	Tag,
	message,
	Popconfirm,
	Typography,
	Radio,
	Divider,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { mockDestinations } from '../../../../mock/mockData';
import { useModel } from 'umi';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const DestinationManagement = () => {
	const {
		form,
		data,
		setData,
		isModalOpen,
		setIsModalOpen,
		editingId,
		setEditingId,
		previewVisible,
		setPreviewVisible,
		previewImage,
		setPreviewImage,
		fileList,
		setFileList,
		loading,
		setLoading,
		searchText,
		setSearchText,
		filterType,
		setFilterType,
		handleCancel,
		handlePreview,
		handleChange,
		handlePreviewCancel,
		handleUpload,
		onFinish,
	} = useModel('kehoachdulich.admin');

	// Load mock data
	useEffect(() => {
		setData(mockDestinations);
	}, []);

	const showModal = (record = null) => {
		setIsModalOpen(true);
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue({
				...record,
				type: record.type || 'city', // Đặt giá trị mặc định nếu không có
			});
			setFileList(
				record.images
					? [
							{
								uid: '-1',
								name: 'destination-image.png',
								status: 'done',
								url: record.images[0],
							},
					  ]
					: [],
			);
		} else {
			setEditingId(null);
			form.resetFields();
			setFileList([]);
		}
	};

	const handleDelete = (id) => {
		const newData = data.filter((item) => item.id !== id);
		setData(newData);
		message.success('Đã xóa điểm đến thành công!');
	};

	const handleSearch = (value) => {
		setSearchText(value);
	};

	const handleFilterChange = (value) => {
		setFilterType(value);
	};

	// Lọc dữ liệu dựa trên các bộ lọc hiện tại
	const filteredData = data.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchText.toLowerCase()) ||
			item.location.toLowerCase().includes(searchText.toLowerCase());
		const matchesType = !filterType || item.type === filterType;
		return matchesSearch && matchesType;
	});

	const columns = [
		{
			title: 'Hình ảnh',
			dataIndex: 'images',
			key: 'images',
			width: 100,
			render: (images) => (
				<img
					src={images && images.length > 0 ? images[0] : 'https://via.placeholder.com/50x50'}
					alt='Destination'
					style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
				/>
			),
		},
		{
			title: 'Tên điểm đến',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Địa điểm',
			dataIndex: 'location',
			key: 'location',
		},
		{
			title: 'Loại hình',
			dataIndex: 'type',
			key: 'type',
			render: (type) => {
				let color = 'blue';
				if (type === 'beach') {
					color = 'cyan';
				} else if (type === 'mountain') {
					color = 'green';
				}
				return <Tag color={color}>{type === 'beach' ? 'Biển' : type === 'mountain' ? 'Núi' : 'Thành phố'}</Tag>;
			},
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
			render: (rating) => <Rate disabled defaultValue={rating} />,
			sorter: (a, b) => a.rating - b.rating,
		},
		{
			title: 'Chi phí',
			dataIndex: 'costs',
			key: 'costs',
			render: (costs) => (
				<>
					<div>Lưu trú: {costs.accommodation.toLocaleString()}đ</div>
					<div>Ăn uống: {costs.food.toLocaleString()}đ</div>
					<div>Di chuyển: {costs.transportation.toLocaleString()}đ</div>
				</>
			),
		},
		{
			title: 'Thời gian tham quan',
			dataIndex: 'visitDuration',
			key: 'visitDuration',
			render: (duration) => `${duration} giờ`,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space size='middle'>
					<Tooltip title='Chỉnh sửa'>
						<Button type='primary' icon={<EditOutlined />} onClick={() => showModal(record)} />
					</Tooltip>
					<Popconfirm
						title='Bạn có chắc muốn xóa điểm đến này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Tải lên</div>
		</div>
	);

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap' }}>
				<Title level={2}>Quản lý điểm đến</Title>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => showModal()}>
					Thêm điểm đến mới
				</Button>
			</div>

			<div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
				<Input
					placeholder='Tìm kiếm theo tên hoặc địa điểm'
					prefix={<SearchOutlined />}
					style={{ width: 300 }}
					value={searchText}
					onChange={(e) => handleSearch(e.target.value)}
				/>

				<Select
					placeholder='Lọc theo loại hình'
					style={{ width: 200 }}
					allowClear
					onChange={handleFilterChange}
					value={filterType}
				>
					<Option value='beach'>Biển</Option>
					<Option value='mountain'>Núi</Option>
					<Option value='city'>Thành phố</Option>
				</Select>
			</div>

			<Table
				columns={columns}
				dataSource={filteredData}
				rowKey='id'
				scroll={{ x: 'max-content' }}
				pagination={{ pageSize: 10 }}
			/>
		</div>
	);
};

export default DestinationManagement;
