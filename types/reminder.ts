export interface ReminderData {
  id: string;
  title: string;
  reminderDate: Date;
  isSent: boolean;
  todoId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReminderData {
  title: string;
  reminderDate: Date;
  todoId: string;
}
