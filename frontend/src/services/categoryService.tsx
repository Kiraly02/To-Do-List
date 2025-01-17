import axios from 'axios';
import { Category } from '../types/types';

export const getAllCategories = async (signal?: AbortSignal) => await axios.get<Category[]>("/api/categories", { signal });

export const getCategoryById = async (id: number, signal?: AbortSignal) => await axios.get<Category>(`/api/categories/${id}`, { signal });

export const addCategory = async (category: Category) => await axios.post<Category>("/api/categories", category);

export const deleteCategory = async (id: number) => await axios.delete(`/api/categories/${id}`);