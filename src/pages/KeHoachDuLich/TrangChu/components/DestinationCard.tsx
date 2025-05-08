import React from 'react';
import { Card, Tag } from 'antd';
import { EnvironmentOutlined, StarFilled } from '@ant-design/icons';
import type { Destination } from '../../../../services/KeHoachDuLich/TrangChu/types';

interface Props {
	destination: Destination;
}

const DestinationCard: React.FC<Props> = ({ destination }) => {
	const { name, image, location, rating, cost, type } = destination;

	const totalCost = cost.food + cost.transport + cost.accommodation;

	const typeColors = {
		biển: 'blue',
		núi: 'green',
		'thành phố': 'purple',
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN').format(price);
	};

	return (
		<Card
			hoverable
			cover={<img alt={name} src={image} style={{ height: 150, objectFit: 'cover' }} />}
			style={{ marginBottom: 16 }}
		>
			<div style={{ position: 'absolute', top: 8, right: 8 }}>
				<Tag color={typeColors[type as keyof typeof typeColors]}>{type}</Tag>
			</div>

			<Card.Meta
				title={name}
				description={
					<span>
						<EnvironmentOutlined style={{ marginRight: 4 }} />
						{location}
					</span>
				}
			/>

			<div style={{ marginTop: 12 }}>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
					<StarFilled style={{ color: '#fadb14', marginRight: 4 }} />
					<span>{rating}/5</span>
				</div>

				<div style={{ fontWeight: 'bold', marginTop: 8 }}>Tổng chi phí: {formatPrice(totalCost)} VND</div>

				<div style={{ fontSize: '0.9em', color: '#999', marginTop: 4 }}>
					<div>Ăn uống: {formatPrice(cost.food)} VND</div>
					<div>Di chuyển: {formatPrice(cost.transport)} VND</div>
					<div>Lưu trú: {formatPrice(cost.accommodation)} VND</div>
				</div>
			</div>
		</Card>
	);
};

export default DestinationCard;
