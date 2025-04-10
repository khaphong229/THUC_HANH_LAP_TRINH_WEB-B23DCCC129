import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, message } from 'antd';
import type { Register } from '@/services/DonDangKy/typing';
import { RegisterService } from '@/services/DonDangKy/api';
import RegisterForm from './components/RegisterForm';
import { Modal } from 'antd';
import Descriptions from 'antd/es/descriptions';
import type { RegisterHistory } from '@/services/DonDangKy/typing';
import { useModel } from 'umi';

const RegisterList: React.FC = () => {
	const {
		registers,
		setRegisters,
		loading,
		setLoading,
		isModalVisible,
		setIsModalVisible,
		selectedRegister,
		setSelectedRegister,
		detailVisible,
		setDetailVisible,
		detailRecord,
		setDetailRecord,
		selectedRowKeys,
		setSelectedRowKeys,
		selectedRows,
		setSelectedRows,
		handleEdit,
		handleCancel,
		handleDelete,
		handleView,
		handleSave,
		fetchRegisters,
	} = useModel('quanlyclb.dondangky');

	useEffect(() => {
		fetchRegisters();
	}, []);

	const columns = [
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
			key: 'fullName',
			align: 'center' as 'center',
		},
		{
			title: 'Tên CLB',
			dataIndex: 'clubName',
			key: 'clubName',
			align: 'center' as 'center',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			align: 'center' as 'center',
		},
		{
			title: 'SĐT',
			dataIndex: 'phone',
			key: 'phone',
			align: 'center' as 'center',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			align: 'center' as 'center',
		},
		{
			title: 'Thao tác',
			key: 'actions',
			align: 'center' as 'center',
			render: (_: any, record: Register) => (
				<>
					<Button type='link' onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => handleDelete(record)}>
						Xóa
					</Button>
					<Button type='link' danger onClick={() => handleView(record)}>
						Chi tiết
					</Button>
				</>
			),
		},
	];

	const rowSelection = {
		selectedRowKeys,
		onChange: (newSelectedRowKeys: React.Key[], selectedRows: Register[]) => {
			setSelectedRowKeys(newSelectedRowKeys);
			setSelectedRows(selectedRows);
		},
	};

	const handleBatchApprove = async () => {
		try {
			await Promise.all(
				selectedRows.map((record) => {
					const newHistory: RegisterHistory = {
						action: 'Approved' as const,
						timestamp: new Date().toISOString(),
						by: 'Admin hệ thống',
					};

					return RegisterService.updateRegister(record.id.toString(), {
						...record,
						status: 'Approved',
						history: [...(record.history || []), newHistory],
					});
				}),
			);
			message.success(`Duyệt ${selectedRows.length} đơn thành công`);
			fetchRegisters();
			setSelectedRowKeys([]);
		} catch (error) {
			message.error('Duyệt thất bại');
			console.error(error);
		}
	};

	const handleBatchReject = async () => {
		let note = '';
		Modal.confirm({
			title: 'Từ chối đơn',
			content: (
				<Input.TextArea
					placeholder='Nhập lý do từ chối'
					onChange={(e) => {
						note = e.target.value;
					}}
				/>
			),
			onOk: async () => {
				try {
					await Promise.all(
						selectedRows.map((record) => {
							const newHistory: RegisterHistory = {
								action: 'Rejected' as const,
								timestamp: new Date().toISOString(),
								by: 'Admin hệ thống',
								note,
							};

							return RegisterService.updateRegister(record.id.toString(), {
								...record,
								status: 'Rejected',
								rejectionNote: note,
								history: [...(record.history || []), newHistory],
							});
						}),
					);
					message.success(`Từ chối ${selectedRows.length} đơn thành công`);
					fetchRegisters();
					setSelectedRowKeys([]);
				} catch (error) {
					message.error('Từ chối thất bại');
					console.error(error);
				}
			},
		});
	};

	return (
		<div>
			<h2>Danh sách đơn đăng ký</h2>
			<Button type='primary' onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
				Thêm đơn đăng ký
			</Button>
			{selectedRowKeys.length > 0 && (
				<div style={{ marginBottom: 16 }}>
					<Button type='primary' onClick={handleBatchApprove} style={{ marginRight: 8 }}>
						Duyệt {selectedRowKeys.length} đơn đã chọn
					</Button>
					<Button danger onClick={handleBatchReject}>
						Từ chối {selectedRowKeys.length} đơn đã chọn
					</Button>
				</div>
			)}

			<Table
				rowKey='id'
				columns={columns}
				dataSource={registers}
				loading={loading}
				pagination={{ pageSize: 10 }}
				rowSelection={rowSelection}
			/>
			<RegisterForm
				visible={isModalVisible}
				onCancel={handleCancel}
				onSave={handleSave}
				initialValues={selectedRegister}
				subjects={[]} // truyền nếu có
			/>

			<Modal
				visible={detailVisible}
				onCancel={() => setDetailVisible(false)}
				footer={null}
				title='Chi tiết đơn đăng ký'
			>
				{detailRecord && (
					<Descriptions bordered column={1}>
						<Descriptions.Item label='Họ tên'>{detailRecord.fullName}</Descriptions.Item>
						<Descriptions.Item label='Email'>{detailRecord.email}</Descriptions.Item>
						<Descriptions.Item label='Số điện thoại'>{detailRecord.phone}</Descriptions.Item>
						<Descriptions.Item label='Giới tính'>{detailRecord.gender}</Descriptions.Item>
						<Descriptions.Item label='Địa chỉ'>{detailRecord.address}</Descriptions.Item>
						<Descriptions.Item label='Thế mạnh'>{detailRecord.strengths}</Descriptions.Item>
						<Descriptions.Item label='Lý do'>{detailRecord.reason}</Descriptions.Item>
						<Descriptions.Item label='Trạng thái'>{detailRecord.status}</Descriptions.Item>

						{detailRecord.status === 'Rejected' && (
							<Descriptions.Item label='Lý do từ chối'>{detailRecord.rejectionNote}</Descriptions.Item>
						)}

						{detailRecord.history?.map((item, index) => (
							<Descriptions.Item
								key={index}
								label={`[${item.action}] bởi ${item.by} lúc ${new Date(item.timestamp).toLocaleString()}`}
							>
								{item.note || '—'}
							</Descriptions.Item>
						))}
					</Descriptions>
				)}
			</Modal>
		</div>
	);
};

export default RegisterList;
