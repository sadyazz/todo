import { Model } from '@nozbe/watermelondb';
import { field, date, relation, children } from '@nozbe/watermelondb/decorators';

export class Todo extends Model {
  static table = 'todos';
  static associations = {
    category: { type: 'belongs_to' as const, key: 'category_id' },
    reminders: { type: 'has_many' as const, foreignKey: 'todo_id' },
  };

  @field('title') title!: string;
  @field('description') description?: string;
  @field('is_completed') isCompleted!: boolean;
  @date('due_date') dueDate?: Date;
  @field('priority') priority!: string;
  @field('category_id') categoryId!: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @relation('categories', 'category_id') category!: any;
  @children('reminders') reminders!: any[];
}
