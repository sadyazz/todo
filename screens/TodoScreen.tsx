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
      await database.write(async () => {
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
      });
      setShowAddTodo(false);
    } catch (error) {
      console.error('Error adding todo:', error);
      Alert.alert('Error', 'Failed to add todo');
    }
  };

  const buttons: TabButtonType[] = [
    { title: "Not Finished" },
    { title: "Finished" }
  ];

  if(showAddTodo){
    return <AddTodoScreen onBack={()=>setShowAddTodo(false)}
    onSave={handleAddTodo} />
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
          <TodoList todos={todos.filter(todo => !todo.isCompleted)} />
        ) : (
          <TodoList todos={todos.filter(todo => todo.isCompleted)} />
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