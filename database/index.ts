import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Category } from '../models/Category';
import { Todo } from '../models/Todo';
import { Reminder } from '../models/Reminder';
import { schema } from './schema';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    console.error('Database setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Category, Todo, Reminder],
});
