package com.example.ToDoListBRT.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ToDoListBRT.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer>{

}
