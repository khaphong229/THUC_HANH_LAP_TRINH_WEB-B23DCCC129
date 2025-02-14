import { useEffect } from 'react';
import { Card } from 'antd';
import { useModel } from 'umi';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import styles from './index.less';

const TodoList = () => {
	const { todos, getTodoList, updateTodoStatus, startEdit, deleteTodo } = useModel('todolist');

	const doneTodos = todos.filter((todo) => todo.done);
	const notdoneTodos = todos.filter((todo) => !todo.done);

	useEffect(() => {
		getTodoList();
	}, []);

	return (
		<Card className={styles.todoList}>
			<div className={styles.todoListContainer}>
				<TaskInput />
				<TaskList
					todos={notdoneTodos}
					handleDoneTodo={updateTodoStatus}
					startEditTodo={startEdit}
					deleteTodo={deleteTodo}
				/>
				<TaskList
					doneTaskList
					todos={doneTodos}
					handleDoneTodo={updateTodoStatus}
					startEditTodo={startEdit}
					deleteTodo={deleteTodo}
				/>
			</div>
		</Card>
	);
};

export default TodoList;
