import { Form, message } from 'antd';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [fileList, setFileList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [filterType, setFilterType] = useState(null);

	const [form] = Form.useForm();

	const handleCancel = () => {
		setIsModalOpen(false);
		form.resetFields();
	};

	const handlePreview = (file) => {
		setPreviewImage(file.url || file.thumbUrl);
		setPreviewVisible(true);
	};

	const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

	const handlePreviewCancel = () => setPreviewVisible(false);

	const handleUpload = (options) => {
		const { onSuccess } = options;
		setTimeout(() => {
			onSuccess('ok');
		}, 0);
	};

	const onFinish = (values) => {
		setLoading(true);

		const imageUrl =
			fileList.length > 0
				? fileList[0].url || 'https://via.placeholder.com/300x200'
				: 'https://via.placeholder.com/300x200';

		setTimeout(() => {
			if (editingId) {
				// Cập nhật điểm đến hiện có
				const updatedData = data.map((item) =>
					item.id === editingId
						? {
								...item,
								...values,
								images: [imageUrl],
						  }
						: item,
				);
				setData(updatedData);
				message.success('Đã cập nhật điểm đến thành công!');
			} else {
				// Thêm điểm đến mới
				const newDestination = {
					id: Date.now(),
					...values,
					images: [imageUrl],
					createdAt: new Date().toISOString(),
				};
				setData([...data, newDestination]);
				message.success('Đã thêm điểm đến mới thành công!');
			}

			setIsModalOpen(false);
			form.resetFields();
			setLoading(false);
		}, 500);
	};

	return {
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
	};
};
