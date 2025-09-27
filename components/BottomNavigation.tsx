import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface BottomNavigationProps {
  selectedTab: number;
  onTabPress: (index: number) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  selectedTab,
  onTabPress,
}) => {
  const { isDark } = useTheme();
  const tabs = [
    { title: 'Today', icon: 'calendar-outline', selectedIcon: 'calendar' },
    { title: 'Todos', icon: 'list-outline', selectedIcon: 'list' },
    { title: 'Settings', icon: 'settings-outline', selectedIcon: 'settings' },
  ];

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isSelected = selectedTab === index;
        return (
          <Pressable
            key={index}
            style={styles.tab}
            onPress={() => onTabPress(index)}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={
                  isSelected ? (tab.selectedIcon as any) : (tab.icon as any)
                }
                size={24}
                color={isSelected ? '#c333cc' : isDark ? '#666' : '#666'}
              />
            </View>
            {/* <Text style={[styles.title, isSelected && styles.selectedTitle]}>
              {tab.title}
            </Text> */}
          </Pressable>
        );
      })}
    </View>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      borderTopWidth: 1,
      borderTopColor: isDark ? '#333' : '#e0e0e0',
      paddingVertical: 12,
      paddingHorizontal: 8,
      // shadowColor: '#000',
      // shadowOffset: {
      //   width: 0,
      //   height: -2,
      // },
      // shadowOpacity: 0.1,
      // shadowRadius: 3,
      // elevation: 5,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: 12,
      marginHorizontal: 4,
    },
    iconContainer: {
      marginBottom: 4,
    },
    title: {
      fontSize: 11,
      color: isDark ? '#666' : '#666',
      fontWeight: '500',
    },
    selectedTitle: {
      color: '#c333cc',
      fontWeight: '600',
    },
  });

export default BottomNavigation;
