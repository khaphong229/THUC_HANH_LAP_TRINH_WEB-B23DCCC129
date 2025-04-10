// src/components/common/ColumnChart.tsx
import React from 'react';
import { Column } from '@ant-design/plots';

interface DataItem {
  type: string;
  value: number;
}

interface ColumnChartProps {
  data: DataItem[];
  height?: number;
  title?: string;
  xField?: string;
  yField?: string;
  color?: string | string[];
  loading?: boolean;
  showLabel?: boolean;
}

const ColumnChart: React.FC<ColumnChartProps> = ({
  data,
  height = 300,
  title = 'Biểu đồ cột',
  xField = 'type',
  yField = 'value',
  color = '#1890ff',
  loading = false,
  showLabel = true,
}) => {
  const config = {
    data,
    xField,
    yField,
    label: showLabel ? {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    } : false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
    },
    meta: {
      [yField]: {
        alias: 'Giá trị',
      },
      [xField]: {
        alias: 'Loại',
      },
    },
    color,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    tooltip: {
      showMarkers: false,
    },
    interactions: [
      {
        type: 'active-region',
        enable: true,
      },
    ],
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          strokeOpacity: 0.2,
        },
      },
    },
    animation: {
      appear: {
        animation: 'fade-in',
      },
    },
  };

  return (
    <div style={{ height, marginBottom: 20 }}>
      {title && <h3 style={{ textAlign: 'center', marginBottom: 16 }}>{title}</h3>}
      <Column loading={loading} {...config} />
    </div>
  );
};

export default ColumnChart;