import { Form, Input, InputNumber, TimePicker, Button, Progress, Card, Modal } from 'antd';
import { useState } from 'react';
import type { IRecord } from '@/services/Subject/typing';
import styles from './subject-infor.less';

interface SubjectInforProps {
	sub: IRecord;
	onClose: () => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

const { TextArea } = Input;

export default function SubjectInfor({ sub, onClose, onEdit, onDelete }: SubjectInforProps) {
	console.log('SubjectInfor received sub:', sub);
	const [form] = Form.useForm();
	const [subjectData, setSubjectData] = useState<IRecord>({
		id: sub?.id || '',
		name: sub?.name || '',
		time: sub?.time || '',
		duration: sub?.duration || '',
		content: sub?.content || '',
		notes: sub?.notes || '',
	});

	const [goals, setGoals] = useState({
		monthlyTarget: 0,
		currentProgress: 0,
		specificGoals: 'Complete all practice exercises and score above 80% on final exam',
	});

	const progressPercentage = (goals.currentProgress / goals.monthlyTarget) * 100;

	const handleSave = (values: any) => {
		console.log('Saved values:', values);
		onClose();
	};

	return (
		<Modal title='Subject Information' visible={true} onCancel={onClose} width={800} footer={null}>
			<Form form={form} layout='vertical' initialValues={subjectData} onFinish={handleSave}>
				<Form.Item label='Subject Name' name='name' rules={[{ required: true, message: 'Please input subject name!' }]}>
					<Input />
				</Form.Item>

				<div className={styles.formGrid}>
					<Form.Item label='Class Time' name='time'>
						<TimePicker format='HH:mm' className={styles.fullWidth} />
					</Form.Item>

					<Form.Item label='Duration (minutes)' name='duration'>
						<InputNumber min={1} className={styles.fullWidth} />
					</Form.Item>
				</div>

				<Form.Item label='Content' name='content'>
					<TextArea rows={4} />
				</Form.Item>

				<Form.Item label='Notes' name='notes'>
					<TextArea rows={3} />
				</Form.Item>

				<Card title='Learning Goals' className={styles.goalsSection}>
					<Form.Item label='Monthly Study Target (hours)' name='monthlyTarget'>
						<InputNumber min={1} />
					</Form.Item>

					<div className={styles.progressSection}>
						<div>Progress</div>
						<Progress percent={progressPercentage} />
						<div className={styles.progressText}>
							{goals.currentProgress} of {goals.monthlyTarget} hours completed
						</div>
					</div>

					<Form.Item label='Specific Goals' name='specificGoals'>
						<TextArea rows={3} />
					</Form.Item>
				</Card>

				<div className={styles.footer}>
					<Button onClick={onClose}>Cancel</Button>
					<Button type='primary' htmlType='submit'>
						Save Changes
					</Button>
					<Button danger onClick={() => onDelete(subjectData.id)}>
						Delete
					</Button>
				</div>
			</Form>
		</Modal>
	);
}
