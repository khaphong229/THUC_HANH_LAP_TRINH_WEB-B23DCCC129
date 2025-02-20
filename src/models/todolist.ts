import { useState } from 'react';
import type { Todo } from '@/services/Todolist/typing';

export default () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

	const getTodoList = () => {
		const todosString = localStorage.getItem('todos');
		const todosObj: Todo[] = JSON.parse(todosString || '[]');
		setTodos(todosObj);
	};

	const syncToLocal = (handler: (todos: Todo[]) => Todo[]) => {
		const todosString = localStorage.getItem('todos');
		const todosObj: Todo[] = JSON.parse(todosString || '[]');
		const newTodosObj = handler(todosObj);
		localStorage.setItem('todos', JSON.stringify(newTodosObj));
	};

	const addTodo = (name: string) => {
		const todo: Todo = {
			name,
			done: false,
			id: new Date().toISOString(),
		};
		setTodos((prev) => [...prev, todo]);
		syncToLocal((todosObj) => [...todosObj, todo]);
	};

	const updateTodoStatus = (id: string, done: boolean) => {
		setTodos((prev) => {
			return prev.map((todo) => {
				if (todo.id === id) {
					return { ...todo, done };
				}
				return todo;
			});
		});
		syncToLocal((prev) => {
			return prev.map((todo) => {
				if (todo.id === id) {
					return { ...todo, done };
				}
				return todo;
			});
		});
	};

	const startEdit = (id: string) => {
		const findedTodo = todos.find((todo) => todo.id === id);
		if (findedTodo) {
			setCurrentTodo(findedTodo);
		}
	};

	const editTodo = (name: string) => {
		setCurrentTodo((prev: Todo | null) => {
			if (prev) return { ...prev, name };
			return null;
		});
	};

	const finishEdit = () => {
		const handler = (todoObj: Todo[]) => {
			return todoObj.map((todo) => {
				if (todo.id === (currentTodo as Todo).id) {
					return currentTodo as Todo;
				}
				return todo;
			});
		};
		setTodos(handler);
		setCurrentTodo(null);
		syncToLocal(handler);
	};

	const deleteTodo = (id: string) => {
		if (currentTodo) {
			setCurrentTodo(null);
		}
		const handler = (todoObj: Todo[]) => {
			const findedIndexTodo = todoObj.findIndex((todo) => todo.id === id);
			if (findedIndexTodo > -1) {
				const result = [...todoObj];
				result.splice(findedIndexTodo, 1);
				return result;
			}
			return todoObj;
		};
		setTodos(handler);
		syncToLocal(handler);
	};

	return {
		todos,
		currentTodo,
		getTodoList,
		addTodo,
		updateTodoStatus,
		startEdit,
		editTodo,
		finishEdit,
		deleteTodo,
	};
};
