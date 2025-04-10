// src/components/common/UploadFile.tsx
import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile as AntdUploadFile, UploadProps } from 'antd/es/upload/interface';

interface UploadFileProps {
  value?: string; // Có thể là URL hoặc base64
  onChange?: (value: string) => void;
  maxCount?: number;
  accept?: string;
  useBase64?: boolean; // Thêm option để chọn sử dụng base64 hay không
}

const UploadFile: React.FC<UploadFileProps> = ({
  value,
  onChange,
  maxCount = 1,
  accept = 'image/*',
  useBase64 = true, // Mặc định sử dụng base64
}) => {
  const [fileList, setFileList] = useState<AntdUploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Cập nhật fileList khi value thay đổi từ bên ngoài
    if (value && fileList.length === 0) {
      setFileList([
        {
          uid: '-1',
          name: 'image',
          status: 'done',
          url: value.startsWith('data:') ? value : value, // Xử lý cả base64 và URL
        },
      ]);
    } else if (!value) {
      setFileList([]);
    }
  }, [value]);

  // Hàm chuyển file sang base64
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
    setFileList(newFileList);
    
    if (file.status === 'done' && onChange) {
      // Nếu đã xử lý xong trong customRequest, sử dụng kết quả đã có
      if (file.response) {
        onChange(file.response.url);
      }
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên file ảnh!');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải có kích thước nhỏ hơn 2MB!');
    }
    
    return isImage && isLt2M;
  };

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      setLoading(true);
      
      if (useBase64) {
        // Mã hóa file thành base64
        const base64Data = await getBase64(file);
        
        // Giả lập quá trình tải lên server
        setTimeout(() => {
          const mockResponse = {
            url: base64Data, // Trả về chuỗi base64
          };
          onSuccess(mockResponse, file);
          if (onChange) {
            onChange(base64Data);
          }
          setLoading(false);
        }, 1000);
      } else {
        // Sử dụng URL thông thường (trong thực tế sẽ tải lên server)
        setTimeout(() => {
          const mockResponse = {
            url: URL.createObjectURL(file), // Tạo URL tạm thời
          };
          onSuccess(mockResponse, file);
          if (onChange) {
            onChange(mockResponse.url);
          }
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      onError(error);
      setLoading(false);
      message.error('Tải lên thất bại');
    }
  };

  // Xử lý hiển thị preview cho base64 hoặc URL
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
      maxCount={maxCount}
      accept={accept}
      customRequest={customRequest}
      beforeUpload={beforeUpload}
      onPreview={(file) => {
        const previewUrl = file.url || file.thumbUrl;
        if (previewUrl) {
          window.open(previewUrl);
        }
      }}
    >
      {fileList.length >= maxCount ? null : uploadButton}
    </Upload>
  );
};

export default UploadFile;