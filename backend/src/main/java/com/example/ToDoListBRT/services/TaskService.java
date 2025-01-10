package com.example.ToDoListBRT.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ToDoListBRT.entities.Task;
import com.example.ToDoListBRT.exceptions.TaskNotFoundException;
import com.example.ToDoListBRT.repositories.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Integer id) {
        return taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException("Task " + id + " not found."));
    }

    public List<Task> getTasksWithFilters(Long categoryId, Boolean completed) {
        if (categoryId != null && completed != null) {
            return taskRepository.findByCategoryIdAndCompleted(categoryId, completed);
        } else if (categoryId != null) {
            return taskRepository.findByCategoryId(categoryId);
        } else if (completed != null) {
            return taskRepository.findByCompleted(completed);
        } else {
            return taskRepository.findAll();
        }
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Integer id, Task updatedTask) {
        Task existingTask = getTaskById(id);
        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setCategory(updatedTask.getCategory());
        existingTask.setDueDate(updatedTask.getDueDate());
        existingTask.setCompleted(updatedTask.isCompleted());
        return taskRepository.save(existingTask);
    }

    public void deleteTaskById(Integer id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException("Task " + id + " not found.");
        }
        taskRepository.deleteById(id);
    }

}
