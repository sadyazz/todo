import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { useTheme } from '../contexts/ThemeContext';
import { CategoryData, CategoryColor } from '../types';

interface CategoriesScreenProps {
  onBack: () => void;
}

const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState<CategoryColor>('#c333cc');
  const [showEditModal, setShowEditModal] = useState(false);
  const database = useDatabase();

  const categoriesQuery = database.get('categories').query(Q.sortBy('created_at', Q.desc));
  const categoriesFromDB = categoriesQuery.observe();

  useEffect(() => {
    const subscription = categoriesFromDB.subscribe((categoriesFromDatabase) => {
      const categoryData: CategoryData[] = categoriesFromDatabase.map((category: any) => ({
        id: category.id,
        name: category.name,
        color: category.color,
      }));
      setCategories(categoryData);
    });

    return () => subscription.unsubscribe();
  }, []);

  const categoryColors: CategoryColor[] = [
    '#c333cc', '#2196F3', '#4CAF50', '#FF9800', '#F44336', 
    '#9C27B0', '#00BCD4', '#8BC34A', '#FFC107', '#E91E63'
  ];

  const handleEditCategory = (category: CategoryData) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditColor(category.color);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }

    if (!editingCategory) return;

    try {
      await database.write(async () => {
        const category = await database.get('categories').find(editingCategory.id);
        await category.update((categoryRecord: any) => {
          categoryRecord.name = editName.trim();
          categoryRecord.color = editColor;
          categoryRecord.updatedAt = new Date();
        });
      });

      // Force refresh after update
      setTimeout(() => refreshCategories(), 100);
      
      setShowEditModal(false);
      setEditingCategory(null);
      setEditName('');
    } catch (error) {
      console.error('Error updating category:', error);
      Alert.alert('Error', 'Failed to update category');
    }
  };

  const refreshCategories = async () => {
    try {
      const freshCategories = await database.get('categories').query(Q.sortBy('created_at', Q.desc)).fetch();
      const categoryData: CategoryData[] = freshCategories.map((category: any) => ({
        id: category.id,
        name: category.name,
        color: category.color,
      }));
      setCategories(categoryData);
      console.log('Categories refreshed:', categoryData.length);
    } catch (error) {
      console.error('Error refreshing categories:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.write(async () => {
                const category = await database.get('categories').find(categoryId);
                await category.destroyPermanently();
              });
              
              // Force refresh after delete
              setTimeout(() => refreshCategories(), 100);
            } catch (error) {
              console.error('Error deleting category:', error);
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ]
    );
  };

  const styles = createStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
        </TouchableOpacity>
        <Text style={styles.title}>Categories</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {categories.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="folder-outline" 
              size={64} 
              color={isDark ? "#666" : "#999"} 
            />
            <Text style={styles.emptyText}>No categories yet</Text>
            <Text style={styles.emptySubtext}>Create categories when adding todos</Text>
          </View>
        ) : (
          categories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              <View style={styles.categoryActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditCategory(category)}
                >
                  <Ionicons name="color-palette-outline" size={20} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteCategory(category.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Category</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Category name..."
                placeholderTextColor={isDark ? "#666" : "#999"}
                autoFocus
              />

              <Text style={styles.inputLabel}>Color</Text>
              <View style={styles.colorPicker}>
                {categoryColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      editColor === color && styles.selectedColor
                    ]}
                    onPress={() => setEditColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: isDark ? '#666' : '#999',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: isDark ? '#555' : '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 16,
  },
  categoryName: {
    fontSize: 16,
    color: isDark ? '#fff' : '#333',
    fontWeight: '500',
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
  },
  modalBody: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: isDark ? '#fff' : '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: isDark ? '#fff' : '#333',
    backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
    marginBottom: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: isDark ? '#fff' : '#333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#e0e0e0',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: isDark ? '#666' : '#999',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#c333cc',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default CategoriesScreen;
