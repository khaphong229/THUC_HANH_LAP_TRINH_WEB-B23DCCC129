import { Form, Input, Button } from 'antd';
import { useModel } from 'umi';
import styles from './taskInput.less';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const TaskInput = () => {
	const [form] = Form.useForm();
	const { currentTodo, addTodo, editTodo, finishEdit } = useModel('todolist');

	useEffect(() => {
		if (currentTodo) {
			form.setFieldsValue({ name: currentTodo.name });
		} else {
			form.resetFields();
		}
	}, [currentTodo, form]);

	const handleSubmit = (values: { name: string }) => {
		if (currentTodo) {
			finishEdit();
		} else {
			addTodo(values.name);
		}
		form.resetFields();
	};

	const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (currentTodo) {
			editTodo(e.target.value);
		}
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>ToDo List</h1>
			<Form form={form} onFinish={handleSubmit} className={styles.form}>
				<Form.Item name='name' rules={[{ required: true, message: 'Please input todo name!' }]}>
					<Input placeholder='Enter your todo' onChange={onChangeInput} />
				</Form.Item>
				<Button type='primary' htmlType='submit'>
					{currentTodo ? <CheckOutlined /> : <PlusOutlined />}
				</Button>
			</Form>
		</div>
	);
};

export default TaskInput;
