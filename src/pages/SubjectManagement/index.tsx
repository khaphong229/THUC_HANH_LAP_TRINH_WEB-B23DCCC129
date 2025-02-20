import { Button, Card, Col, Form, Input, Row } from 'antd';
import styles from './index.less';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useModel } from 'umi';

export default function SubjectManagement() {
	const [form] = Form.useForm();
	const { subs, currentSubs, getSubsList, addSub, updateSubStatus, startEdit, editSub, finishEdit, deleteSub } =
		useModel('subject-management');

	useEffect(() => {
		if (currentSubs) {
			form.setFieldsValue({ name: currentSubs.name });
		} else {
			form.resetFields();
		}
	}, [currentSubs, form]);

	useEffect(() => {
		getSubsList();
	}, []);

	const handleSubmit = (values: { name: string }) => {
		if (currentSubs) {
			finishEdit();
		} else {
			addSub(values.name);
		}
		form.resetFields();
	};

	const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (currentSubs) {
			{
				editSub(e.target.value);
			}
		}
	};

	return (
		<div className={styles.SubjectContainer}>
			<div className={styles.inputContainer}>
				<h1 className={styles.title}>Subject Management</h1>
				<Form form={form} onFinish={handleSubmit} className={styles.form}>
					<Form.Item
						name='name'
						rules={[
							{
								required: true,
								message: 'Please input subject name!',
							},
						]}
					>
						<Input placeholder='Enter subject name' onChange={onChangeInput} />
					</Form.Item>
					<Button type='primary' htmlType='submit' className={styles.buttonInput}>
						<PlusOutlined />
					</Button>
				</Form>
			</div>
			<div className='subjectListContainer'>
				<Row gutter={[16, 16]}>
					{subs.map((sub) => (
						<Col span={6}>
							<Card title={sub.name} className={styles.cardSub}>
								<div className={styles.actionButton}>
									<Button type='text' icon={<EditOutlined />} onClick={() => startEdit(sub.id)} />
									<Button type='text' danger icon={<DeleteOutlined />} onClick={() => deleteSub(sub.id)} />
								</div>
							</Card>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
}
