import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import TabButtons, { TabButtonType } from '../components/TabButtons';
import TodoList from '../components/TodoList';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddTodoScreen from './AddTodoScreen';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { TodoData } from '../types';

export enum TodoTab {
  NotFinished,
  Finished
}

const TodosScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TodoTab>(TodoTab.NotFinished);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoData | undefined>(undefined);
  const [todos, setTodos] = useState<TodoData[]>([]);
  const database = useDatabase();

  const todosQuery = database.get('todos').query(Q.sortBy('created_at', Q.desc));
  const todosFromDB = todosQuery.observe();

  useEffect(() => {
    const subscription = todosFromDB.subscribe((todosFromDatabase) => {
      const todoData: TodoData[] = todosFromDatabase.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        isCompleted: todo.isCompleted,
        dueDate: todo.dueDate,
        priority: todo.priority,
        categoryId: todo.categoryId,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      }));
      setTodos(todoData);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddTodo = async (todoData: any) => {
    try {
      console.log('Saving todo:', { editingTodo, todoData });
      
      await database.write(async () => {
        if (editingTodo) {
          // Update existing todo
          console.log('Updating todo with ID:', editingTodo.id);
          const todo = await database.get('todos').find(editingTodo.id);
          await todo.update((todoRecord: any) => {
            todoRecord.title = todoData.title;
            todoRecord.description = todoData.description || '';
            todoRecord.dueDate = todoData.dueDate;
            todoRecord.priority = todoData.priority;
            todoRecord.categoryId = todoData.categoryId;
            todoRecord.updatedAt = new Date();
          });
          console.log('Todo updated successfully');
        } else {
          // Create new todo
          console.log('Creating new todo');
          await database.get('todos').create((todo: any) => {
            todo.title = todoData.title;
            todo.description = todoData.description || '';
            todo.isCompleted = false;
            todo.dueDate = todoData.dueDate;
            todo.priority = todoData.priority;
            todo.categoryId = todoData.categoryId;
            todo.createdAt = new Date();
            todo.updatedAt = new Date();
          });
          console.log('Todo created successfully');
        }
      });
      
      setShowAddTodo(false);
      setEditingTodo(undefined);
      // Force refresh after save
      setTimeout(() => refreshTodos(), 100);
    } catch (error) {
      console.error('Error saving todo:', error);
      Alert.alert('Error', 'Failed to save todo');
    }
  };

  const handleTodoPress = (todo: TodoData) => {
    setEditingTodo(todo);
    setShowAddTodo(true);
  };

  const handleBack = () => {
    setShowAddTodo(false);
    setEditingTodo(undefined);
    // Force refresh of todos data
    refreshTodos();
  };

  const handleToggleComplete = async (todo: TodoData) => {
    try {
      console.log('Toggling todo completion:', todo.id, !todo.isCompleted);
      
      await database.write(async () => {
        const todoRecord = await database.get('todos').find(todo.id);
        await todoRecord.update((todoUpdate: any) => {
          todoUpdate.isCompleted = !todo.isCompleted;
          todoUpdate.updatedAt = new Date();
        });
      });
      
      console.log('Todo completion toggled successfully');
      // Force refresh after update
      setTimeout(() => refreshTodos(), 100);
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  const refreshTodos = async () => {
    try {
      // Force a fresh query to refresh the data
      const freshTodos = await database.get('todos').query(Q.sortBy('created_at', Q.desc)).fetch();
      const todoData: TodoData[] = freshTodos.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        isCompleted: todo.isCompleted,
        dueDate: todo.dueDate,
        priority: todo.priority,
        categoryId: todo.categoryId,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      }));
      setTodos(todoData);
      console.log('Todos refreshed:', todoData.length);
    } catch (error) {
      console.error('Error refreshing todos:', error);
    }
  };

  const buttons: TabButtonType[] = [
    { title: "Not Finished" },
    { title: "Finished" }
  ];

  if(showAddTodo){
    return <AddTodoScreen 
      onBack={handleBack}
      onSave={handleAddTodo}
      editTodo={editingTodo}
    />
  }

  return (
    <View style={styles.container}>
      <TabButtons
        buttons={buttons}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <View style={styles.content}>
        {selectedTab === TodoTab.NotFinished ? (
          <TodoList 
            todos={todos.filter(todo => !todo.isCompleted)} 
            onTodoPress={handleTodoPress}
            onToggleComplete={handleToggleComplete}
          />
        ) : (
          <TodoList 
            todos={todos.filter(todo => todo.isCompleted)} 
            onTodoPress={handleTodoPress}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </View>
      <TouchableOpacity
      style={styles.fab}
      onPress={() => setShowAddTodo(true)}
    >
      <Ionicons name="add" size={24} color="#fff" />
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#c333cc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default TodosScreen;