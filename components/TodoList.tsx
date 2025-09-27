import React from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TodoData, Priority, CategoryData } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { formatDate, isOverdue } from '../utils/dateUtils';

interface TodoListProps {
  todos: TodoData[];
  onTodoPress?: (todo: TodoData) => void;
  onToggleComplete?: (todo: TodoData) => void;
}

const TodoList = ({ todos, onTodoPress, onToggleComplete }: TodoListProps) => {
  const { isDark } = useTheme();
  const database = useDatabase();
  const styles = createStyles(isDark);

  const categoriesQuery = database
    .get('categories')
    .query(Q.sortBy('created_at', Q.desc));
  const categoriesFromDB = categoriesQuery.observe();

  const [categories, setCategories] = React.useState<CategoryData[]>([]);

  React.useEffect(() => {
    const subscription = categoriesFromDB.subscribe(categoriesFromDatabase => {
      const categoryData: CategoryData[] = categoriesFromDatabase.map(
        (category: any) => ({
          id: category.id,
          name: category.name,
          color: category.color,
        })
      );
      setCategories(categoryData);
    });
    return () => subscription.unsubscribe();
  }, []);

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

  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#c333cc';
  };

  const formatDueDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    const isOverdueDate = isOverdue(date);

    if (isOverdueDate) {
      return 'Overdue';
    } else if (isToday) {
      return 'Today';
    } else if (isTomorrow) {
      return 'Tomorrow';
    } else {
      return formatDate(date);
    }
  };

  const formatReminderTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDueDateColor = (date: Date, isDark: boolean): string => {
    if (isOverdue(date)) {
      return '#F44336';
    } else if (date.toDateString() === new Date().toDateString()) {
      return '#FF9800';
    } else {
      return isDark ? '#666' : '#999';
    }
  };

  const renderTodo = ({ item }: { item: TodoData }) => {
    const priorityColor = getPriorityColor(item.priority);
    const categoryColor = getCategoryColor(item.categoryId);

    return (
      <TouchableOpacity
        style={[
          styles.todoItem,
          { borderColor: priorityColor, borderWidth: 2 },
        ]}
        onPress={() => onTodoPress?.(item)}
      >
        <View style={styles.todoContent}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => onToggleComplete?.(item)}
          >
            <Ionicons
              name={item.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={item.isCompleted ? '#4CAF50' : isDark ? '#666' : '#ccc'}
            />
          </TouchableOpacity>
          <View style={styles.todoTextContainer}>
            <Text
              style={[
                styles.todoTitle,
                item.isCompleted && styles.completedTodoTitle,
              ]}
            >
              {item.title}
            </Text>
            {item.description && (
              <Text
                style={[
                  styles.todoDescription,
                  item.isCompleted && styles.completedTodoDescription,
                ]}
              >
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
                <Text
                  style={[
                    styles.dueDateText,
                    { color: getDueDateColor(item.dueDate, isDark) },
                  ]}
                >
                  {formatDueDate(item.dueDate)}
                </Text>
              </View>
            )}
            {item.reminderDate && (
              <View style={styles.dueDateContainer}>
                <Ionicons
                  name="alarm-outline"
                  size={12}
                  color={isDark ? '#c333cc' : '#c333cc'}
                />
                <Text
                  style={[
                    styles.dueDateText,
                    { color: isDark ? '#c333cc' : '#c333cc' },
                  ]}
                >
                  Reminder: {formatReminderTime(item.reminderDate)}
                </Text>
              </View>
            )}
          </View>
          <View
            style={[
              styles.priorityIndicator,
              { backgroundColor: categoryColor },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={todos}
      renderItem={renderTodo}
      keyExtractor={item => item.id}
      style={styles.container}
    />
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
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
  });
export default TodoList;
