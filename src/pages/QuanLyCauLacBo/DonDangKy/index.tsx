import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, message } from 'antd';
import { Register } from '@/services/DonDangKy/typing';
import { RegisterService } from '@/services/DonDangKy/api';
import RegisterForm from './components/RegisterForm';

const { Option } = Select;

const RegisterList: React.FC = () => {
  const [registers, setRegisters] = useState<Register[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedRegister, setSelectedRegister] = useState<Register | null>(null);

  const fetchRegisters = async () => {
    try {
      setLoading(true);
      const data = await RegisterService.getAllRegisters();
      setRegisters(data);
    } catch (error) {
      message.error('Không thể tải danh sách đăng ký');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisters();
  }, []);

  const handleEdit = (record: Register) => {
    setSelectedRegister(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRegister(null);
  };

  const handleSave = async (values: Register) => {
	try {
	  if (values.id) {
		// Cập nhật
		await RegisterService.updateRegister(values.id.toString(), values);
		message.success('Cập nhật thành công');
	  } else {
		// Thêm mới
		await RegisterService.createRegister(values);
		message.success('Thêm mới thành công');
	  }
	  fetchRegisters();
	  setIsModalVisible(false);
	  setSelectedRegister(null);
	} catch (error) {
	  message.error('Lưu thất bại');
	  console.error(error);
	}
  };
  
  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Register) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách đơn đăng ký</h2>
	  <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
		Thêm đơn đăng ký
		</Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={registers}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <RegisterForm
        visible={isModalVisible}
        onCancel={handleCancel}
        onSave={handleSave}
        initialValues={selectedRegister}
        subjects={[]} // truyền nếu có
      />
    </div>
  );
};

export default RegisterList;
