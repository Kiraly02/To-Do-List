import React, { useEffect, useState } from "react";
import { Task, Category } from "../types/types";
import { getAllTasks, editTask, deleteTask, getTasksWithFilters } from "../services/taskService";
import { getAllCategories } from "../services/categoryService";
import TaskForm from "./TaskForm";

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTask, setEditedTask] = useState<Task | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | "">("");
    const [selectedCompletion, setSelectedCompletion] = useState<string>("");

    useEffect(() => {
        loadTasks();
        loadCategories();
    }, []);

    const loadTasks = async () => {
        try {
            const response = await getAllTasks();
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const applyFilters = async () => {
        try {
            let categoryFilter;
            if (selectedCategory == "") {
                categoryFilter = undefined;
            } else {
                categoryFilter = Number(selectedCategory);
            }
            let completionFilter;
            if (selectedCompletion == "") {
                completionFilter = undefined;
            } else {
                completionFilter = selectedCompletion == "true";
            }
            const filteredTasks = await getTasksWithFilters(categoryFilter, completionFilter);
            setTasks(filteredTasks.data);
        } catch (error) {
            console.error("Error filtering tasks:", error);
        }
    };
    

    const handleEdit = (task: Task) => {
        setEditingTaskId(task.id || null);
        setEditedTask({ ...task });
        loadCategories();
        loadTasks();
    };

    const handleCancel = () => {
        setEditingTaskId(null);
        setEditedTask(null);
        loadTasks();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (editedTask) {
            const { name, value, type } = e.target;
            // Controlla se l'input è un checkbox per poter usare checked
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
                loadTasks();
            } catch (error) {
                console.error("Error updating task:", error);
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(id);
                alert("Task deleted successfully!");
                loadTasks();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Tasks</h2>
            <TaskForm onTaskAdded={loadTasks} />
            {/*Filtri*/}
            <div className="filters mb-4 mt-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="filterCategory" className="form-label">Filter by Category</label>
                        <select
                            id="filterCategory"
                            className="form-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value === "" ? "" : Number(e.target.value))}>
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
                            onChange={(e) => setSelectedCompletion(e.target.value)}>
                            <option value="">All tasks</option>
                            <option value="true">Completed</option>
                            <option value="false">Not completed</option>
                        </select>
                    </div>
                </div>
                <button className="btn btn-primary mt-4" onClick={applyFilters}>Apply filters</button>
            </div>
            <div className="table-container">
                <table className="table table-striped">
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
