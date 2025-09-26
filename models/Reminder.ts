import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export class Reminder extends Model {
  static table = 'reminders';
  static associations = {
    todo: { type: 'belongs_to' as const, key: 'todo_id' },
  };

  @field('title') title!: string;
  @date('reminder_date') reminderDate!: Date;
  @field('is_sent') isSent!: boolean;
  @field('todo_id') todoId!: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @relation('todos', 'todo_id') todo!: any;
}
