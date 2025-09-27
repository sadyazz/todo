import React from 'react'
import { Text, StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TodoData, Priority } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface TodoListProps{
    todos: TodoData[];
    onTodoPress?: (todo: TodoData) => void;
    onToggleComplete?: (todo: TodoData) => void;
}

const TodoList = ({todos, onTodoPress, onToggleComplete}: TodoListProps) => {
    const { isDark } = useTheme();
    const styles = createStyles(isDark);
    
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

    const formatDueDate = (date: Date): string => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();
        const isOverdue = date < today && !isToday;
        
        if (isOverdue) {
            return 'Overdue';
        } else if (isToday) {
            return 'Today';
        } else if (isTomorrow) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getDueDateColor = (date: Date, isDark: boolean): string => {
        const today = new Date();
        const isOverdue = date < today && date.toDateString() !== today.toDateString();
        
        if (isOverdue) {
            return '#F44336';
        } else if (date.toDateString() === today.toDateString()) {
            return '#FF9800';
        } else {
            return isDark ? '#666' : '#999';
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
                                color={item.isCompleted ? "#4CAF50" : (isDark ? "#666" : "#ccc")} 
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
                            {item.dueDate && (
                                <View style={styles.dueDateContainer}>
                                    <Ionicons 
                                        name="calendar-outline" 
                                        size={12} 
                                        color={getDueDateColor(item.dueDate, isDark)} 
                                    />
                                    <Text style={[
                                        styles.dueDateText,
                                        { color: getDueDateColor(item.dueDate, isDark) }
                                    ]}>
                                        {formatDueDate(item.dueDate)}
                                    </Text>
                                </View>
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

const createStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    todoItem: {
        backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
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
        color: isDark ? '#fff' : '#333',
    },
    todoDescription: {
        fontSize: 14,
        color: isDark ? '#666' : '#666',
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
        color: isDark ? '#666' : '#999',
    },
    completedTodoDescription: {
        textDecorationLine: 'line-through',
        color: isDark ? '#555' : '#bbb',
    },
    dueDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    dueDateText: {
        fontSize: 12,
        marginLeft: 4,
        fontWeight: '500',
    },
})
export default TodoList