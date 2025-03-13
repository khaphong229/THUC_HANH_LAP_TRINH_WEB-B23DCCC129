import React, { useState, useEffect } from 'react';
import {
	Table,
	Form,
	Input,
	Button,
	InputNumber,
	Space,
	Popconfirm,
	message,
	TimePicker,
	Select,
	Card,
	Typography,
	Collapse,
	Tag,
} from 'antd';
import { UserOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { Log } from 'oidc-client-ts';

const { Option } = Select;
const { Title } = Typography;
const { Panel } = Collapse;
const API_URL = 'https://67d23b2f90e0670699bcba98.mockapi.io/api/v1/tiem-nail/nhan-vien';

const dayMap = {
	Monday: 'Thứ Hai',
	Tuesday: 'Thứ Ba',
	Wednesday: 'Thứ Tư',
	Thursday: 'Thứ Năm',
	Friday: 'Thứ Sáu',
	Saturday: 'Thứ Bảy',
	Sunday: 'Chủ Nhật',
};

export default function EmployeeManagement() {
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	const [editId, setEditId] = useState(null);
	const [selectedDays, setSelectedDays] = useState([]);

	const fetchEmployees = async () => {
		setLoading(true);
		try {
			const response = await axios.get(API_URL);
			setEmployees(response.data);
		} catch (error) {
			console.error('Error fetching employees:', error);
			message.error('Không thể tải danh sách nhân viên');
		} finally {
			setLoading(false);
		}
	};

	const addEmployee = async (values) => {
		console.log(values);

		setLoading(true);
		try {
			
			const work_date_obj = {};
			selectedDays.forEach((day) => {
				if (values[`startTime_${day}`] && values[`endTime_${day}`]) {
					work_date_obj[day] = {
						start: values[`startTime_${day}`].format('HH:mm'),
						end: values[`endTime_${day}`].format('HH:mm'),
					};
				}
			});

			
			const work_date = Object.entries(work_date_obj).map(([day, times]) => ({
				day,
				start: times.start,
				end: times.end,
			}));

			console.log(work_date);

			const employeeData = {
				name: values.name,
				phone: values.phone || '',
				maxCustomers: values.maxCustomers,
				work_date: work_date, 
			};

			const response = await axios.post(API_URL, employeeData);
			setEmployees([...employees, response.data]);
			message.success('Thêm nhân viên thành công');
			form.resetFields();
			setSelectedDays([]);
		} catch (error) {
			console.error('Error adding employee:', error);
			message.error('Không thể thêm nhân viên');
		} finally {
			setLoading(false);
		}
	};

	const updateEmployee = async (values) => {
		setLoading(true);
		try {
			
			const work_date_obj = {};
			selectedDays.forEach((day) => {
				if (values[`startTime_${day}`] && values[`endTime_${day}`]) {
					work_date_obj[day] = {
						start: values[`startTime_${day}`].format('HH:mm'),
						end: values[`endTime_${day}`].format('HH:mm'),
					};
				}
			});

			
			const work_date = Object.entries(work_date_obj).map(([day, times]) => ({
				day,
				start: times.start,
				end: times.end,
			}));

			const employeeData = {
				name: values.name,
				phone: values.phone || '',
				maxCustomers: values.maxCustomers,
				work_date: work_date, 
			};

      console.log(employeeData);

			const response = await axios.put(`${API_URL}/${editId}`, employeeData);
			setEmployees(employees.map((emp) => (emp.id === editId ? response.data : emp)));
			message.success('Cập nhật nhân viên thành công');
			form.resetFields();
			setEditId(null);
			setSelectedDays([]);
		} catch (error) {
			console.error('Error updating employee:', error);
			message.error('Không thể cập nhật nhân viên');
		} finally {
			setLoading(false);
		}
	};

	const deleteEmployee = async (id) => {
		setLoading(true);
		try {
			await axios.delete(`${API_URL}/${id}`);
			setEmployees(employees.filter((emp) => emp.id !== id));
			message.success('Xóa nhân viên thành công');
		} catch (error) {
			console.error('Error deleting employee:', error);
			message.error('Không thể xóa nhân viên');
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (record) => {
		setEditId(record.id);

		const formValues = {
			name: record.name,
			phone: record.phone || '',
			maxCustomers: record.maxCustomers || record.max_customers || 0,
		};

		let days = [];
		const work_date = record.work_date || [];

		if (Array.isArray(work_date)) {
			days = work_date;
		} else if (typeof work_date === 'object') {
			days = Object.keys(work_date);

			days.forEach((day) => {
				if (work_date[day]) {
					formValues[`startTime_${day}`] = moment(work_date[day].start, 'HH:mm');
					formValues[`endTime_${day}`] = moment(work_date[day].end, 'HH:mm');
				}
			});
		}

		setSelectedDays(days);
		form.setFieldsValue(formValues);
	};

	const handleCancelEdit = () => {
		setEditId(null);
		form.resetFields();
		setSelectedDays([]);
	};

	const handleDaysChange = (days) => {
		setSelectedDays(days);
	};

	const formatWorkSchedule = (work_date) => {
    if (
      !work_date ||
      (Array.isArray(work_date) && work_date.length === 0) ||
      (typeof work_date === 'object' && Object.keys(work_date).length === 0)
    ) {
      return 'Chưa có lịch làm việc';
    }
  
    
    if (Array.isArray(work_date)) {
      return (
        <Space size={[0, 8]} direction='vertical' style={{ width: '100%' }}>
          {work_date.map((item) => (
            <Tag color='green' key={item.day}>
              {dayMap[item.day] || item.day}: {item.start}-{item.end}
            </Tag>
          ))}
        </Space>
      );
    }
  
    
    return (
      <Space size={[0, 8]} direction='vertical' style={{ width: '100%' }}>
        {Object.entries(work_date).map(([day, time]) => (
          <Tag color='green' key={day}>
            {dayMap[day] || day}: {time.start}-{time.end}
          </Tag>
        ))}
      </Space>
    );
  };

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 80,
		},
		{
			title: 'Tên nhân viên',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
		},
		{
			title: 'Số khách tối đa/Ngày',
			key: 'max_customers',
			render: (_, record) => record.maxCustomers || record.max_customers || 0,
			width: 180,
		},
		{
			title: 'Lịch làm việc',
			key: 'work_date',
			render: (_, record) => formatWorkSchedule(record.work_date),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 200,
			render: (_, record) => (
				<Space size='small'>
					<Button type='primary' onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa nhân viên này?'
						onConfirm={() => deleteEmployee(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button danger>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	useEffect(() => {
		fetchEmployees();
	}, []);

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Card>
				<Title level={4}>Thêm/Sửa Nhân Viên</Title>
				<Form form={form} layout='vertical' onFinish={editId ? updateEmployee : addEmployee}>
					<Form.Item
						name='name'
						label='Tên nhân viên'
						rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
					>
						<Input prefix={<UserOutlined />} placeholder='Tên nhân viên' />
					</Form.Item>

					<Form.Item name='phone' label='Số điện thoại'>
						<Input placeholder='Số điện thoại' />
					</Form.Item>

					<Form.Item
						name='maxCustomers'
						label='Số khách tối đa/Ngày'
						rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa' }]}
					>
						<InputNumber min={1} placeholder='Số khách tối đa/ngày' style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item label='Ngày làm việc'>
						<Select mode='multiple' placeholder='Chọn ngày làm việc' onChange={handleDaysChange} value={selectedDays}>
							<Option value='Monday'>Thứ Hai</Option>
							<Option value='Tuesday'>Thứ Ba</Option>
							<Option value='Wednesday'>Thứ Tư</Option>
							<Option value='Thursday'>Thứ Năm</Option>
							<Option value='Friday'>Thứ Sáu</Option>
							<Option value='Saturday'>Thứ Bảy</Option>
							<Option value='Sunday'>Chủ Nhật</Option>
						</Select>
					</Form.Item>

					{selectedDays.length > 0 && (
						<Collapse defaultActiveKey={selectedDays}>
							{selectedDays.map((day) => (
								<Panel header={`Giờ làm việc - ${dayMap[day]}`} key={day}>
									<Space style={{ width: '100%', display: 'flex' }}>
										<Form.Item
											name={`startTime_${day}`}
											label='Giờ bắt đầu'
											rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
											style={{ width: '100%' }}
										>
											<TimePicker format='HH:mm' style={{ width: '100%' }} />
										</Form.Item>

										<Form.Item
											name={`endTime_${day}`}
											label='Giờ kết thúc'
											rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
											style={{ width: '100%' }}
										>
											<TimePicker format='HH:mm' style={{ width: '100%' }} />
										</Form.Item>
									</Space>
								</Panel>
							))}
						</Collapse>
					)}

					<Form.Item style={{ marginTop: 16 }}>
						<Space>
							<Button type='primary' htmlType='submit' loading={loading}>
								{editId ? 'Cập nhật' : 'Thêm'}
							</Button>
							{editId && <Button onClick={handleCancelEdit}>Hủy</Button>}
						</Space>
					</Form.Item>
				</Form>
			</Card>

			<Card>
				<Title level={4}>Danh Sách Nhân Viên</Title>
				<Table
					columns={columns}
					dataSource={employees}
					rowKey='id'
					loading={loading}
					pagination={{ pageSize: 5 }}
					scroll={{ x: 800 }}
				/>
			</Card>
		</Space>
	);
}