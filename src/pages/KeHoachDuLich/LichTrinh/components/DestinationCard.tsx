import React from 'react';
import { Card, Tag, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Destination } from '@/services/KeHoachDuLich/LichTrinh/typings';

interface DestinationCardProps {
  destination: Destination;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
  draggableProps?: any;
  innerRef?: any;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onDelete,
  dragHandleProps,
  draggableProps,
  innerRef,
}) => {
  const { id, name, image, location, type, visitDuration, cost } = destination;
  
  const food = typeof cost.food === 'string' ? parseInt(cost.food) : cost.food;
  const transport = typeof cost.transport === 'string' ? parseInt(cost.transport) : cost.transport;
  const accommodation = typeof cost.accommodation === 'string' ? parseInt(cost.accommodation) : cost.accommodation;
  
  const totalCost = (food || 0) + (transport || 0) + (accommodation || 0);
  
  const duration = typeof visitDuration === 'string' ? visitDuration : `${visitDuration} giờ`;

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="draggable-item"
    >
      <Card 
        size="small" 
        title={name}
        extra={
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(id)}
          />
        }
        style={{ marginBottom: 8 }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={image} 
            alt={name} 
            style={{ width: 80, height: 60, objectFit: 'cover', marginRight: 12, borderRadius: 4 }}
          />
          <div>
            <div>{location}</div>
            <Tag color="blue">{type}</Tag>
            <div>Thời gian: {duration}</div>
            <div>Chi phí: {totalCost.toLocaleString('vi-VN')} VND</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DestinationCard; 