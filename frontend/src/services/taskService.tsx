import axios from 'axios';
import { Task } from '../types/types';

export const getAllTasks = () => axios.get<Task[]>("/api/tasks");

export const getTaskById = (id : number) => axios.get<Task>(`/api/tasks/${id}`);

export const getTasksWithFilters = async (categoryId?: number, completed?: boolean) => {
    const params: Record<string, unknown> = {}; 
    if (categoryId !== undefined) params['categoryId'] = categoryId;
    if (completed !== undefined) params['completed'] = completed;
    return await axios.get<Task[]>('/api/tasks/search', { params });
};

export const getTasksByCategory = (id: number) => axios.get<Task[]>(`/api/tasks/category/${id}`);

export const addTask = (task: Task) => axios.post<Task>("/api/tasks", task);

export const editTask = (id: number, task: Task) => axios.put<Task>(`/api/tasks/${id}`, task);

export const deleteTask = (id: number) => axios.delete(`/api/tasks/${id}`);
