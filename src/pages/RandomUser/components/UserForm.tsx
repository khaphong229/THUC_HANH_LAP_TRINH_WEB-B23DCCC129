import { Form, Input, Button } from 'antd';

interface UserFormProps {
	initialValues?: RandomUser.Record;
	onFinish: (values: RandomUser.Record) => void;
	onCancel: () => void;
	isEdit: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialValues, onFinish, onCancel, isEdit }) => {
	return (
		<Form onFinish={onFinish} initialValues={initialValues}>
			<Form.Item label='Address' name='address' rules={[{ required: true, message: 'Please input your address!' }]}>
				<Input />
			</Form.Item>
			<Form.Item label='Balance' name='balance' rules={[{ required: true, message: 'Please input your balance!' }]}>
				<Input />
			</Form.Item>
			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{isEdit ? 'Save' : 'Insert'}
				</Button>
				<Button onClick={onCancel}>Cancel</Button>
			</div>
		</Form>
	);
};

export default UserForm;
