import React, { useEffect, useState } from "react";
import { Task, Category } from "../types/types";
import { editTask, deleteTask, getTasksWithFilters } from "../services/taskService";
import { getAllCategories } from "../services/categoryService";
import TaskForm from "./TaskForm";
import axios from "axios";

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTask, setEditedTask] = useState<Task | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | "">("");
    const [selectedCompletion, setSelectedCompletion] = useState<string>("");

    useEffect(() => {
        const controller = new AbortController();
        const applyFilters = async () => {
            try {
                const categoryFilter = selectedCategory === "" ? undefined : Number(selectedCategory);
                const completionFilter = selectedCompletion === "" ? undefined : selectedCompletion === "true";
    
                const response = await getTasksWithFilters(categoryFilter, completionFilter, controller.signal);
                setTasks(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
                    console.log("Request cancelled");
                } else {
                    console.error("Error on fetching tasks:", error);
                }
            }
            return () => controller.abort();
        };
        applyFilters();
    }, [selectedCategory, selectedCompletion]);   
    
    useEffect(() => {
        const controller = new AbortController();
        const loadCategories = async () => {
            try {
                const response = await getAllCategories(controller.signal);
                setCategories(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
                    console.log("Request cancelled");
                } else {
                    console.error("Error on fetching categories:", error);
                }
            }
            return () => controller.abort();
        };
        loadCategories();
    }, []);  

    const loadTasksFiltered = async () => {
        try {
            const categoryFilter = selectedCategory === "" ? undefined : Number(selectedCategory);
            const completionFilter = selectedCompletion === "" ? undefined : selectedCompletion === "true";
            const response = await getTasksWithFilters(categoryFilter, completionFilter);
            setTasks(response.data);
        } catch (error) {
            console.error("Error on fetching tasks:", error);
        }
    }   

    const handleEdit = (task: Task) => {
        setEditingTaskId(task.id || null);
        setEditedTask({ ...task });
        loadTasksFiltered();
    };

    const handleCancel = () => {
        setEditingTaskId(null);
        setEditedTask(null);
        loadTasksFiltered();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (editedTask) {
            const { name, value, type } = e.target;
            const fieldValue = type == "checkbox" ? (e.target as HTMLInputElement).checked : value;
            setEditedTask({
                ...editedTask,
                [name]: fieldValue,
            });
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (editedTask) {
            const selectedCategoryId = parseInt(e.target.value, 10);
            const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
            setEditedTask({ ...editedTask, category: selectedCategory || editedTask.category });
        }
    };

    const handleSave = async () => {
        if (editedTask && editedTask.id) {
            try {
                await editTask(editedTask.id, editedTask);
                alert("Task updated successfully!");
                setEditingTaskId(null);
                setEditedTask(null);
                loadTasksFiltered();
            } catch (error) {
                console.error("Error on updating task:", error);
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(id);
                alert("Task deleted successfully!");
                loadTasksFiltered();
            } catch (error) {
                console.error("Error on deleting task:", error);
            }
        }
    };

    const categoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value === "" ? "" : Number(e.target.value));
    }

    const completedFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCompletion(e.target.value);
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Tasks</h2>
            <TaskForm onTaskAdded={loadTasksFiltered} />
            {/*Filtri*/}
            <div className="filters mb-4 mt-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="filterCategory" className="form-label">Filter by category</label>
                        <select
                            id="filterCategory"
                            className="form-select"
                            value={selectedCategory}
                            onChange={(e) => categoryFilterChange(e)}>
                            <option value="">All categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="filterCompletion" className="form-label">Filter by completion</label>
                        <select
                            id="filterCompletion"
                            className="form-select"
                            value={selectedCompletion}
                            onChange={(e) => completedFilterChange(e)}>
                            <option value="">All tasks</option>
                            <option value="true">Completed</option>
                            <option value="false">Not completed</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="table-container">
                <table className="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Completed</th>
                            <th>Due date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                {editingTaskId === task.id ? (
                                    <>
                                        {/*modifica task*/}
                                        <td>{task.id}</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                value={editedTask?.title || ""}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                value={editedTask?.description || ""}
                                                onChange={handleChange}/>
                                        </td>
                                        <td>
                                            <select
                                                className="form-select"
                                                name="category"
                                                value={editedTask?.category?.id || ""}
                                                onChange={handleCategoryChange}>
                                                <option value="">Select category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="completed"
                                                checked={editedTask?.completed || false}
                                                onChange={handleChange}/>
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="dueDate"
                                                value={editedTask?.dueDate || ""}
                                                onChange={handleChange}/>
                                        </td>
                                        <td>
                                            <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                                            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        {/*visualizza task*/}
                                        <td>{task.id}</td>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>{task.category.name}</td>
                                        <td>{task.completed ? "Yes" : "No"}</td>
                                        <td>{task.dueDate}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(task)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id || 0)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );    
};

export default TaskList;
