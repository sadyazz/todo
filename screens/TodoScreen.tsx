import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TabButtons, { TabButtonType } from '../components/TabButtons';
import TodoList from '../components/TodoList';

export enum TodoTab {
  NotFinished,
  Finished
}

const TodosScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TodoTab>(TodoTab.NotFinished);

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
});

export default TodosScreen;