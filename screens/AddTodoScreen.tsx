import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { CategoryData, CreateTodoData, TodoData, Priority, PriorityOption, CategoryColor } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddTodoScreenProps {
  onBack: () => void;
  onSave: (todo: CreateTodoData) => void;
  editTodo?: TodoData;
}

const AddTodoScreen: React.FC<AddTodoScreenProps> = ({ onBack, onSave, editTodo }) => {
  const [title, setTitle] = useState(editTodo?.title || '');
  const [description, setDescription] = useState(editTodo?.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(editTodo?.dueDate);
  const [priority, setPriority] = useState<Priority>(editTodo?.priority || 'medium');
  const [categoryId, setCategoryId] = useState(editTodo?.categoryId || 'default');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState<CategoryColor>('#c333cc');
  const [categoryNameError, setCategoryNameError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const database = useDatabase();
  
  const categoriesQuery = database.get('categories').query(Q.sortBy('created_at', Q.desc));
  const categoriesFromDB = categoriesQuery.observe();

  useEffect(() => {
    const subscription = categoriesFromDB.subscribe((categories) => {
      const categoryData: CategoryData[] = categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        color: category.color,
      }));
      setCategories(categoryData);
    });

    return () => subscription.unsubscribe();
  }, []);

  const priorities: PriorityOption[] = [
    { value: 'low', label: 'Low', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'high', label: 'High', color: '#F44336' },
  ];

  const [categories, setCategories] = useState<CategoryData[]>([]);

  const categoryColors: CategoryColor[] = [
    '#c333cc', '#2196F3', '#4CAF50', '#FF9800', '#F44336', 
    '#9C27B0', '#00BCD4', '#8BC34A', '#FFC107', '#E91E63'
  ];

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    
    setTitleError('');
    onSave({ 
      title: title.trim(), 
      description: description.trim(),
      dueDate,
      priority,
      categoryId
    });
    onBack();
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (titleError) {
      setTitleError('');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryNameError('Category name is required');
      return;
    }
    
    setCategoryNameError('');
    
    try{
        await database.write(async () => {
            const newCategory = await database.get('categories').create((category: any) => {
                category.name = newCategoryName.trim();
                category.color = newCategoryColor;
                category.createdAt = new Date();
                category.updatedAt = new Date();
            });

            // Database subscription will automatically update the categories list
            setCategoryId(newCategory.id);
            setNewCategoryName('');
            setShowAddCategory(false);
        });
        } catch(error){
            console.error('Error adding category:', error);
            Alert.alert('Error', 'Failed to add category');
        }
  };

  const handleCategoryNameChange = (text: string) => {
    setNewCategoryName(text);
    if (categoryNameError) {
      setCategoryNameError('');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const clearDate = () => {
    setDueDate(undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#c333cc" />
        </TouchableOpacity>
        <Text style={styles.title}>{editTodo ? 'Edit Todo' : 'Add New Todo'}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={[
              styles.input,
              titleError && styles.inputError
            ]}
            value={title}
            onChangeText={handleTitleChange}
            placeholder="Enter todo title..."
            placeholderTextColor="#999"
          />
          {titleError ? (
            <Text style={styles.errorText}>{titleError}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Due Date</Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => {
                console.log('Date button pressed, showDatePicker:', showDatePicker);
                setShowDatePicker(true);
              }}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateText}>
                {dueDate ? formatDate(dueDate) : 'Select date (optional)'}
              </Text>
            </TouchableOpacity>
            {dueDate && (
              <TouchableOpacity 
                style={styles.clearDateButton}
                onPress={clearDate}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          {showDatePicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={dueDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
              {Platform.OS === 'ios' && (
                <View style={styles.datePickerActions}>
                  <TouchableOpacity 
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.datePickerButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.datePickerButton, styles.datePickerButtonPrimary]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={[styles.datePickerButtonText, styles.datePickerButtonTextPrimary]}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.priorityButton,
                  priority === p.value && styles.selectedPriority,
                  { 
                    borderColor: p.color,
                    borderWidth: priority === p.value ? 2 : 1
                  }
                ]}
                onPress={() => setPriority(p.value as Priority)}
              >
                <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                <Text style={[
                  styles.priorityText,
                  priority === p.value && styles.selectedPriorityText
                ]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          
          {!showAddCategory ? (
            <View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
                style={styles.categoryScrollView}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      categoryId === category.id && styles.selectedCategory,
                      { 
                        borderColor: category.color,
                        borderWidth: categoryId === category.id ? 2 : 1
                      }
                    ]}
                    onPress={() => setCategoryId(category.id)}
                  >
                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    <Text style={[
                      styles.categoryText,
                      categoryId === category.id && styles.selectedCategoryText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity
                style={styles.addCategoryButton}
                onPress={() => setShowAddCategory(true)}
              >
                <Ionicons name="add" size={16} color="#c333cc" />
                <Text style={styles.addCategoryText}>Add New Category</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.addCategorySection}>
              <View style={styles.addCategoryHeader}>
                <Text style={styles.addCategoryTitle}>New Category</Text>
                <TouchableOpacity onPress={() => setShowAddCategory(false)}>
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={[
                  styles.input,
                  categoryNameError && styles.inputError
                ]}
                value={newCategoryName}
                onChangeText={handleCategoryNameChange}
                placeholder="Category name..."
                placeholderTextColor="#999"
              />
              {categoryNameError ? (
                <Text style={styles.errorText}>{categoryNameError}</Text>
              ) : null}
              
              <View style={styles.colorPicker}>
                <Text style={styles.colorLabel}>Color:</Text>
                <View style={styles.colorOptions}>
                  {categoryColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        newCategoryColor === color && styles.selectedColor
                      ]}
                      onPress={() => setNewCategoryColor(color)}
                    />
                  ))}
                </View>
              </View>
              
              <View style={styles.addCategoryActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddCategory(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleAddCategory}
                >
                  <Text style={styles.createText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    fontSize: 16,
    color: '#c333cc',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  clearDateButton: {
    marginLeft: 8,
    padding: 4,
  },
  datePickerContainer: {
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  datePickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  datePickerButtonPrimary: {
    backgroundColor: '#c333cc',
    borderColor: '#c333cc',
  },
  datePickerButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  datePickerButtonTextPrimary: {
    color: '#fff',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  selectedPriority: {
    backgroundColor: '#f0f0f0',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 14,
    color: '#666',
  },
  selectedPriorityText: {
    color: '#333',
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryScrollView: {
    maxHeight: 60,
    marginHorizontal: -4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    minWidth: 100,
    flexShrink: 0,
  },
  selectedCategory: {
    backgroundColor: '#f0f0f0',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#333',
    fontWeight: '600',
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c333cc',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginHorizontal: -4,
    backgroundColor: '#fafafa',
  },
  addCategoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#c333cc',
    fontWeight: '500',
  },
  addCategorySection: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  addCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  colorPicker: {
    marginVertical: 12,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 4,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#e0e0e0',
    margin: 2,
  },
  selectedColor: {
    borderColor: '#333',
    borderWidth: 3,
  },
  addCategoryActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  createButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#c333cc',
    alignItems: 'center',
  },
  createText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#F44336',
    borderWidth: 2,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default AddTodoScreen;