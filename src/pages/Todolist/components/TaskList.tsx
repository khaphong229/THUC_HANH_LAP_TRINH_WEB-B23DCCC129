import { Card, Checkbox, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Todo } from '@/services/Todolist/typing';
import styles from './taskList.less';

interface TaskListProps {
	doneTaskList?: boolean;
	todos: Todo[];
	handleDoneTodo: (id: string, done: boolean) => void;
	startEditTodo: (id: string) => void;
	deleteTodo: (id: string) => void;
}

const TaskList = (props: TaskListProps) => {
	const { doneTaskList, todos, handleDoneTodo, startEditTodo, deleteTodo } = props;

	return (
		<Card title={doneTaskList ? 'Done' : 'Not Done'} className={styles.card}>
			{todos.map((todo) => (
				<div className={styles.task} key={todo.id}>
					<Checkbox checked={todo.done} onChange={(e) => handleDoneTodo(todo.id, e.target.checked)} />
					<span className={`${styles.taskName} ${todo.done ? styles.taskNameDone : ''}`}>{todo.name}</span>
					<div className={styles.taskActions}>
						<Button type='text' icon={<EditOutlined />} onClick={() => startEditTodo(todo.id)} />
						<Button type='text' danger icon={<DeleteOutlined />} onClick={() => deleteTodo(todo.id)} />
					</div>
				</div>
			))}
		</Card>
	);
};

export default TaskList;
