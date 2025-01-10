export interface Task {
    id?: number;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
    category: Category; 
}

export interface Category {
    id?: number;
    name: string;
}