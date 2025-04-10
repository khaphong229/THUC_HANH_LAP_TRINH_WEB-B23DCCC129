// src/components/common/ImageDisplay.tsx
import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface ImageDisplayProps {
  src?: string;
  alt?: string;
  size?: number;
  shape?: 'circle' | 'square';
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}

// Component để hiển thị ảnh từ URL hoặc base64
const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt = 'image',
  size = 64,
  shape = 'square',
  className,
  style,
  fallback,
}) => {
  // Kiểm tra xem src có phải là base64 hoặc URL hợp lệ không
  const isValidSrc = (src?: unknown): boolean => {
    if (typeof src !== 'string') return false;
    return src.startsWith('data:') || src.startsWith('http') || src.startsWith('blob:');
  };

  // Nếu không có ảnh hoặc ảnh không hợp lệ, hiển thị fallback
  if (!isValidSrc(src)) {
    return (
      <Avatar
        size={size}
        shape={shape}
        className={className}
        style={style}
        icon={fallback || <UserOutlined />}
      >
        {alt?.charAt(0)?.toUpperCase()}
      </Avatar>
    );
  }

  // Hiển thị ảnh từ URL hoặc base64
  return (
    <Avatar
      size={size}
      shape={shape}
      src={src}
      alt={alt}
      className={className}
      style={style}
    />
  );
};

export default ImageDisplay;
