import { Button, Modal, Form, Input, InputNumber, Upload, Rate, Radio, Divider } from 'antd';

import { useModel } from 'umi';
const { TextArea } = Input;

export default function ModalForm() {
	const {
		form,
		data,
		setData,
		isModalOpen,
		setIsModalOpen,
		editingId,
		setEditingId,
		previewVisible,
		setPreviewVisible,
		previewImage,
		setPreviewImage,
		fileList,
		setFileList,
		loading,
		setLoading,
		searchText,
		setSearchText,
		filterType,
		setFilterType,
		handleCancel,
		handlePreview,
		handleChange,
		handlePreviewCancel,
		handleUpload,
		onFinish,
	} = useModel('kehoachdulich.admin');
	return (
		<div>
			<Modal
				title={editingId ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
				visible={isModalOpen}
				onCancel={handleCancel}
				footer={null}
				width={800}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={onFinish}
					initialValues={{
						rating: 5,
						type: 'city',
						visitDuration: 2,
						costs: {
							accommodation: 500000,
							food: 300000,
							transportation: 200000,
						},
					}}
				>
					<div style={{ display: 'flex', gap: '16px' }}>
						<div style={{ flex: 1 }}>
							<Form.Item
								name='name'
								label='Tên điểm đến'
								rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến!' }]}
							>
								<Input placeholder='Nhập tên điểm đến' />
							</Form.Item>

							<Form.Item
								name='location'
								label='Địa điểm'
								rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
							>
								<Input placeholder='Nhập địa điểm' />
							</Form.Item>

							<Form.Item
								name='type'
								label='Loại hình'
								rules={[{ required: true, message: 'Vui lòng chọn loại hình!' }]}
							>
								<Radio.Group>
									<Radio value='beach'>Biển</Radio>
									<Radio value='mountain'>Núi</Radio>
									<Radio value='city'>Thành phố</Radio>
								</Radio.Group>
							</Form.Item>

							<Form.Item
								name='rating'
								label='Đánh giá'
								rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}
							>
								<Rate />
							</Form.Item>
						</div>

						<div style={{ flex: 1 }}>
							<Form.Item
								name='visitDuration'
								label='Thời gian tham quan (giờ)'
								rules={[{ required: true, message: 'Vui lòng nhập thời gian tham quan!' }]}
							>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>

							<Divider>Chi phí</Divider>

							<Form.Item
								name={['costs', 'accommodation']}
								label='Chi phí lưu trú'
								rules={[{ required: true, message: 'Vui lòng nhập chi phí lưu trú!' }]}
							>
								<InputNumber
									min={0}
									style={{ width: '100%' }}
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
									addonAfter='VNĐ'
								/>
							</Form.Item>

							<Form.Item
								name={['costs', 'food']}
								label='Chi phí ăn uống'
								rules={[{ required: true, message: 'Vui lòng nhập chi phí ăn uống!' }]}
							>
								<InputNumber
									min={0}
									style={{ width: '100%' }}
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
									addonAfter='VNĐ'
								/>
							</Form.Item>

							<Form.Item
								name={['costs', 'transportation']}
								label='Chi phí di chuyển'
								rules={[{ required: true, message: 'Vui lòng nhập chi phí di chuyển!' }]}
							>
								<InputNumber
									min={0}
									style={{ width: '100%' }}
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
									addonAfter='VNĐ'
								/>
							</Form.Item>
						</div>
					</div>

					<Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
						<TextArea rows={4} placeholder='Nhập mô tả về điểm đến' />
					</Form.Item>

					<Form.Item label='Hình ảnh'>
						<Upload
							action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
							listType='picture-card'
							fileList={fileList}
							onPreview={handlePreview}
							onChange={handleChange}
							customRequest={handleUpload}
							maxCount={1}
						>
							{fileList.length >= 1 ? null : uploadButton}
						</Upload>
						<Modal open={previewVisible} title='Xem trước hình ảnh' footer={null} onCancel={handlePreviewCancel}>
							<img alt='Xem trước' style={{ width: '100%' }} src={previewImage} />
						</Modal>
					</Form.Item>

					<Form.Item>
						<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
							<Button onClick={handleCancel}>Hủy</Button>
							<Button type='primary' htmlType='submit' loading={loading}>
								{editingId ? 'Cập nhật' : 'Thêm mới'}
							</Button>
						</div>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
