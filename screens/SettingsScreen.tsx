import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { useTheme } from '../contexts/ThemeContext';
import { CategoryData } from '../types';
import CategoriesScreen from './CategoriesScreen';

interface SettingsScreenProps {
  onNavigateToCategories?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigateToCategories }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [showCategories, setShowCategories] = useState(false);
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

  const handleNavigateToCategories = () => {
    if (onNavigateToCategories) {
      onNavigateToCategories();
    } else {
      setShowCategories(true);
    }
  };

  const styles = createStyles(isDark);

  if (showCategories) {
    return <CategoriesScreen onBack={() => setShowCategories(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
            <View style={styles.settingLeft}>
              <Ionicons 
                name={isDark ? "moon" : "sunny"} 
                size={24} 
                color={isDark ? "#fff" : "#333"} 
              />
              <Text style={styles.settingText}>Theme</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>
                {theme === 'dark' ? 'Dark' : 'Light'}
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? "#666" : "#999"} 
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories ({categories.length})</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleNavigateToCategories}>
            <View style={styles.settingLeft}>
              <Ionicons 
                name="folder-outline" 
                size={24} 
                color={isDark ? "#fff" : "#333"} 
              />
              <Text style={styles.settingText}>Manage Categories</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{categories.length} categories</Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? "#666" : "#999"} 
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons 
                name="information-circle-outline" 
                size={24} 
                color={isDark ? "#fff" : "#333"} 
              />
              <Text style={styles.settingText}>Version</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#fff' : '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: isDark ? '#fff' : '#333',
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: isDark ? '#666' : '#999',
    marginRight: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: isDark ? '#666' : '#999',
    marginTop: 12,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: isDark ? '#555' : '#bbb',
    marginTop: 4,
    textAlign: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: isDark ? '#fff' : '#333',
  },
  deleteButton: {
    padding: 8,
  },
});

export default SettingsScreen;
