import React from 'react';
import { Space, Tag } from 'antd';
import { dayMap } from '@/services/NhanVien/constants';
import type { NhanVien } from '@/services/NhanVien/typing';

interface WorkScheduleDisplayProps {
  workDate: NhanVien.WorkDay[] | Record<string, NhanVien.WorkTime> | undefined;
}

const WorkScheduleDisplay: React.FC<WorkScheduleDisplayProps> = ({ workDate }) => {
  if (
    !workDate ||
    (Array.isArray(workDate) && workDate.length === 0) ||
    (typeof workDate === 'object' && Object.keys(workDate).length === 0)
  ) {
    return <span>Chưa có lịch làm việc</span>;
  }

  // If workDate is an array
  if (Array.isArray(workDate)) {
    return (
      <Space size={[0, 8]} direction='vertical' style={{ width: '100%' }}>
        {workDate.map((item) => (
          <Tag color='green' key={item.day}>
            {dayMap[item.day as keyof typeof dayMap] || item.day}: {item.start}-{item.end}
          </Tag>
        ))}
      </Space>
    );
  }

  // If workDate is an object
  return (
    <Space size={[0, 8]} direction='vertical' style={{ width: '100%' }}>
      {Object.entries(workDate).map(([day, time]) => (
        <Tag color='green' key={day}>
          {dayMap[day as keyof typeof dayMap] || day}: {time.start}-{time.end}
        </Tag>
      ))}
    </Space>
  );
};

export default WorkScheduleDisplay; 