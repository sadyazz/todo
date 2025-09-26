import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import { DatabaseProvider } from './providers/DatabaseProvider';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import BottomNavigation from './components/BottomNavigation';
import TodosScreen from './screens/TodoScreen';
import SettingsScreen from './screens/SettingsScreen';

export enum MainTab {
  Today,
  Todos,
  Settings
}

const AppContent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<MainTab>(MainTab.Today);
  const { isDark } = useTheme();

  const renderScreen = () => {
    switch (selectedTab) {
      case MainTab.Today:
        return <View style={[styles.placeholder, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <Text style={{ color: isDark ? '#fff' : '#333' }}>Today Screen</Text>
        </View>;
      case MainTab.Todos:
        return <TodosScreen />;
      case MainTab.Settings:
        return <SettingsScreen />;
      default:
        return <TodosScreen />;
    }
  };

  const styles = createStyles(isDark);

  return (
    <DatabaseProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
        <BottomNavigation
          selectedTab={selectedTab}
          onTabPress={setSelectedTab}
        />
      </SafeAreaView>
    </DatabaseProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
  },
  content: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});