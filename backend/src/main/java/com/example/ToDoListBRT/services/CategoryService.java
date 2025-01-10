package com.example.ToDoListBRT.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ToDoListBRT.entities.Category;
import com.example.ToDoListBRT.exceptions.CategoryNotFoundException;
import com.example.ToDoListBRT.repositories.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category " + id + " not found."));
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategoryById(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException("Category " + id + " not found.");
        }
        categoryRepository.deleteById(id);
    }
}
