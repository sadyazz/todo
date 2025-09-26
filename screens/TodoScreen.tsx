import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TabButtons, { TabButtonType } from '../components/TabButtons';
import TodoList from '../components/TodoList';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddTodoScreen from './AddTodoScreen';

export enum TodoTab {
  NotFinished,
  Finished
}

const TodosScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TodoTab>(TodoTab.NotFinished);
  const [showAddTodo, setShowAddTodo] = useState(false);

  const handleAddTodo = () => {
    console.log('add todo');
    setShowAddTodo(false);
  }

  const sampleTodos = [
    { id: '1', title: 'Buy groceries', isCompleted: false },
    { id: '2', title: 'Walk the dog', isCompleted: false },
    { id: '3', title: 'Finish project', isCompleted: false },
    { id: '4', title: 'Call mom', isCompleted: true },
    { id: '5', title: 'Read book', isCompleted: true },
  ];

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
          <TodoList todos={sampleTodos.filter(todo => !todo.isCompleted)} />
        ) : (
          <TodoList todos={sampleTodos.filter(todo => todo.isCompleted)} />
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