import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface Todo {
    id: string;
    title:string;
    isCompleted:boolean;
}

interface TodoListProps{
    todos: Todo[];
}

const TodoList = ({todos}: TodoListProps) => {
    const renderTodo = ({item}:{item:Todo})=>{
        return <View style={styles.todoItem}>
            <Text style={styles.todoTitle}>{item.title}</Text>
        </View>
    }
  return (
    <FlatList
      data={todos}
      renderItem={renderTodo}
      keyExtractor={(item) => item.id}
      style={styles.container}
    />
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    todoItem: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        marginVertical: 4,
        borderRadius: 8,
      },
    todoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})
export default TodoList