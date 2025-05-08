import React, { useEffect } from 'react';
import { Row, Col, Spin, Select, Slider, Radio, Card, Space, Divider } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import DestinationCard from './components/DestinationCard';
import { useModel } from 'umi';

const { Option } = Select;

const HomePage: React.FC = () => {
	const {
		destinations,
		filteredDestinations,
		loading,
		selectedTypes,
		priceRange,
		minRating,
		sortBy,
		sortOrder,
		loadDestinations,
		filterAndSortDestinations,
		handleTypeChange,
		handlePriceChange,
		handleRatingChange,
		handleSortChange,
		toggleSortOrder,
		formatPrice,
		getTotalCost,
	} = useModel('kehoachdulich.trangchu');

	useEffect(() => {
		loadDestinations();
	}, []);

	useEffect(() => {
		filterAndSortDestinations();
	}, [selectedTypes, priceRange, minRating, sortBy, sortOrder, destinations]);

	if (loading) {
		return (
			<div style={{ textAlign: 'center', padding: '50px' }}>
				<Spin size='large' />
			</div>
		);
	}

	const minPrice = Math.min(...destinations.map((d) => getTotalCost(d)));
	const maxPrice = Math.max(...destinations.map((d) => getTotalCost(d)));

	return (
		<div style={{ padding: '20px' }}>
			<h2>Khám phá điểm đến</h2>

			<Card style={{ marginBottom: 20 }}>
				<Space direction='vertical' style={{ width: '100%' }}>
					<h3>Bộ lọc</h3>

					<Row gutter={[16, 16]}>
						<Col xs={24} md={6}>
							<div>
								<h4>Loại hình</h4>
								<Select
									mode='multiple'
									style={{ width: '100%' }}
									placeholder='Chọn loại hình'
									onChange={handleTypeChange}
								>
									<Option value='biển'>Biển</Option>
									<Option value='núi'>Núi</Option>
									<Option value='thành phố'>Thành phố</Option>
								</Select>
							</div>
						</Col>

						<Col xs={24} md={8}>
							<div>
								<h4>
									Tổng chi phí: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
								</h4>
								<Slider
									range
									min={minPrice}
									max={maxPrice}
									step={100000}
									value={priceRange}
									onChange={handlePriceChange}
									tooltip={{ formatter: formatPrice }}
								/>
							</div>
						</Col>

						<Col xs={24} md={4}>
							<div>
								<h4>Đánh giá tối thiểu: {minRating}</h4>
								<Slider min={0} max={5} step={0.5} value={minRating} onChange={handleRatingChange} />
							</div>
						</Col>

						<Col xs={24} md={6}>
							<div>
								<h4>Sắp xếp theo</h4>
								<Space>
									<Select style={{ width: 140 }} value={sortBy} onChange={handleSortChange}>
										<Option value='none'>Mặc định</Option>
										<Option value='name'>Tên</Option>
										<Option value='rating'>Đánh giá</Option>
										<Option value='price'>Giá</Option>
									</Select>
									{sortBy !== 'none' && (
										<Radio.Button onClick={toggleSortOrder}>
											{sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
										</Radio.Button>
									)}
								</Space>
							</div>
						</Col>
					</Row>
				</Space>
			</Card>

			<Divider />

			<div style={{ marginBottom: 16 }}>
				Hiển thị {filteredDestinations.length} / {destinations.length} điểm đến
			</div>

			<Row gutter={[16, 16]}>
				{filteredDestinations.length > 0 ? (
					filteredDestinations.map((destination) => (
						<Col key={destination.id} xs={24} sm={12} md={8} lg={6}>
							<DestinationCard destination={destination} />
						</Col>
					))
				) : (
					<Col span={24}>
						<div style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy kết quả!</div>
					</Col>
				)}
			</Row>
		</div>
	);
};

export default HomePage;
