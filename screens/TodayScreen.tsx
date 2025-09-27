import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import TodoList from '../components/TodoList';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { TodoData } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { isToday } from '../utils/dateUtils';

const TodayScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [todos, setTodos] = useState<TodoData[]>([]);
  const database = useDatabase();

  const todosQuery = database.get('todos').query(Q.sortBy('created_at', Q.desc));
  const todosFromDB = todosQuery.observe();

  useEffect(() => {
    const subscription = todosFromDB.subscribe(todosFromDatabase => {
      const todoData: TodoData[] = todosFromDatabase.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        isCompleted: todo.isCompleted,
        priority: todo.priority,
        dueDate: todo.dueDate,
        categoryId: todo.categoryId,
        reminderDate: todo.reminderDate,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      }));

      const todayTodos = todoData.filter(todo => 
        todo.dueDate && isToday(todo.dueDate)
      );
      
      setTodos(todayTodos);
    });
    return () => subscription.unsubscribe();
  }, []);

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Todos</Text>
      {todos.length === 0 ? (
        <Text style={styles.emptyText}>No todos due today! 🎉</Text>
      ) : (
        <TodoList todos={todos} />
      )}
    </View>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#333',
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: isDark ? '#888' : '#666',
      textAlign: 'center',
      marginTop: 50,
    },
  });

export default TodayScreen;
