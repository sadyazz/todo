import React from 'react'
import { Text, StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TodoData, Priority } from '../types';

interface TodoListProps{
    todos: TodoData[];
    onTodoPress?: (todo: TodoData) => void;
    onToggleComplete?: (todo: TodoData) => void;
}

const TodoList = ({todos, onTodoPress, onToggleComplete}: TodoListProps) => {
    const getPriorityColor = (priority: Priority): string => {
        switch (priority) {
            case 'high':
                return '#F44336';
            case 'medium':
                return '#FF9800';
            case 'low':
                return '#4CAF50';
            default:
                return '#e0e0e0';
        }
    };

    const renderTodo = ({item}:{item:TodoData})=>{
        const priorityColor = getPriorityColor(item.priority);
        
        return (
            <TouchableOpacity 
                style={[
                    styles.todoItem,
                    { borderColor: priorityColor, borderWidth: 2 }
                ]}
                onPress={() => onTodoPress?.(item)}
            >
                <View style={styles.todoContent}>
                    <TouchableOpacity 
                        style={styles.completeButton}
                        onPress={() => onToggleComplete?.(item)}
                    >
                        <Ionicons 
                            name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"} 
                            size={24} 
                            color={item.isCompleted ? "#4CAF50" : "#ccc"} 
                        />
                    </TouchableOpacity>
                    <View style={styles.todoTextContainer}>
                        <Text style={[
                            styles.todoTitle,
                            item.isCompleted && styles.completedTodoTitle
                        ]}>
                            {item.title}
                        </Text>
                        {item.description && (
                            <Text style={[
                                styles.todoDescription,
                                item.isCompleted && styles.completedTodoDescription
                            ]}>
                                {item.description}
                            </Text>
                        )}
                    </View>
                    <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
                </View>
            </TouchableOpacity>
        )
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
        position: 'relative',
    },
    todoContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    completeButton: {
        marginRight: 12,
        padding: 4,
    },
    todoTextContainer: {
        flex: 1,
        marginRight: 12,
    },
    todoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    todoDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    priorityIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 2,
    },
    completedTodoTitle: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    completedTodoDescription: {
        textDecorationLine: 'line-through',
        color: '#bbb',
    },
})
export default TodoList