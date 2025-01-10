import { useEffect, useState } from "react";
import { Category } from "../types/types";
import { deleteCategory, getAllCategories } from "../services/categoryService";
import CategoryForm from "./CategoryForm";

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        loadAllCategories();
    }, []);

    const loadAllCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(id);
                alert("Category deleted successfully.");
                loadAllCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    return (
        <div className="container py-4">
          <h2 className="mb-4">Categories</h2>
          <CategoryForm onCategoryAdded={loadAllCategories} />
          <div className="table-container">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(category.id || 0)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
};

export default CategoryList;
