import axios from 'axios';
import { Task } from '../types/types';

export const getAllTasks = async (signal?: AbortSignal) =>
    await axios.get<Task[]>("/api/tasks", { signal });

export const getTaskById = async (id: number, signal?: AbortSignal) =>
    await axios.get<Task>(`/api/tasks/${id}`, { signal });

export const getTasksWithFilters = async (categoryId?: number, completed?: boolean, signal?: AbortSignal) => {
    const params: Record<string, unknown> = {};
    if (categoryId !== undefined) params['categoryId'] = categoryId;
    if (completed !== undefined) params['completed'] = completed;
    return await axios.get<Task[]>('/api/tasks/search', { params, signal });
};

export const getTasksByCategory = async (id: number, signal?: AbortSignal) =>
    await axios.get<Task[]>(`/api/tasks/category/${id}`, { signal });

export const addTask = async (task: Task) =>
    await axios.post<Task>("/api/tasks", task);

export const editTask = async (id: number, task: Task) =>
    await axios.put<Task>(`/api/tasks/${id}`, task);

export const deleteTask = async (id: number) =>
    await axios.delete(`/api/tasks/${id}`);
