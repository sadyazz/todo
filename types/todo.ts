export interface TodoData {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: Date;
  priority: Priority;
  categoryId: string;
  reminderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoData {
  title: string;
  description: string;
  dueDate?: Date;
  priority: Priority;
  categoryId: string;
  reminderDate?: Date;
}

export type Priority = 'low' | 'medium' | 'high';

export interface PriorityOption {
  value: Priority;
  label: string;
  color: string;
}
