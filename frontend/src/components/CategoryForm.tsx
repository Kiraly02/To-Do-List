import { useState } from "react";
import { Category } from "../types/types";
import { addCategory } from "../services/categoryService";

interface CategoryFormProps {
    onCategoryAdded: () => void;
}

function CategoryForm({ onCategoryAdded }: CategoryFormProps) {
    const [newCategory, setNewCategory] = useState<Category>({
        name: "",
    });

    const addNewCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addCategory(newCategory);
            alert("New category added!");
            setNewCategory({
                name: "",
            });
            onCategoryAdded(); // Richiama la callback per aggiornare le categorie
        } catch (error) {
            console.error("Error on category save:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCategory({
            ...newCategory,
            [name]: value,
        });
    };

    return (
        <form onSubmit={addNewCategory} className="form-layout mb-4">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Category name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={newCategory.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Add category</button>
        </form>
      );
}

export default CategoryForm;
