package com.example.ToDoListBRT.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ToDoListBRT.entities.Task;

public interface TaskRepository extends JpaRepository<Task, Integer>{

    List<Task> findByCategoryId(Long categoryId);
    List<Task> findByCompleted(Boolean completed);
    List<Task> findByCategoryIdAndCompleted(Long categoryId, Boolean completed);

}
