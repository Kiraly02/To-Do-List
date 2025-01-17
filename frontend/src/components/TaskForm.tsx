import React, { useEffect, useState } from "react";
import { getAllCategories } from "../services/categoryService";
import { addTask } from "../services/taskService";
import { Task, Category } from "../types/types";
import axios from "axios";

interface TaskFormProps {
    onTaskAdded: () => void;
}

const TaskForm = ({ onTaskAdded }: TaskFormProps) =>  {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newTask, setNewTask] = useState<Task>({
        title: "",
        description: "",
        category: { id: 0, name: "" },
        completed: false,
        dueDate: ""
    });

    useEffect(() => {
        const loadCategories = async () => {
            const controller = new AbortController();
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTask({
            ...newTask,
            [name]: name === "category" ? { id: parseInt(value), name: "" } : value,
        });
    };

    const addNewTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addTask(newTask);
            alert("Task added successfully!");
            setNewTask({
                title: "",
                description: "",
                category: { id: 0, name: "" },
                completed: false,
                dueDate: ""
            });
            onTaskAdded();
        } catch (error) {
            console.error("Error on adding task:", error);
        }
    };

    return (
        <form onSubmit={addNewTask} className="form-layout">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={newTask.category.id || ""}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                    ))}
                </select>
                </div>
                <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">Due Date</label>
                <input
                    type="date"
                    className="form-control"
                    id="dueDate"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleChange}
                />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Add Task</button>
        </form>
      );
};

export default TaskForm;
