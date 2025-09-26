import { Model } from '@nozbe/watermelondb';
import { field, date, children } from '@nozbe/watermelondb/decorators';

export class Category extends Model {
  static table = 'categories';
  static associations = {
    todos: { type: 'has_many' as const, foreignKey: 'category_id' },
  };

  @field('name') name!: string;
  @field('color') color!: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @children('todos') todos!: any[];
}
