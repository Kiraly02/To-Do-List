import axios from 'axios';
import { Category } from '../types/types';

export const getAllCategories = () => axios.get<Category[]>("/api/categories");

export const getCategoryById = (id: number) => axios.get<Category>(`/api/categories/${id}`);

export const addCategory = (category: Category) => axios.post<Category>("/api/categories", category);

export const deleteCategory = (id: number) => axios.delete(`/api/categories/${id}`);