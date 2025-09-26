import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import { DatabaseProvider } from './providers/DatabaseProvider';
import BottomNavigation from './components/BottomNavigation';
import TodosScreen from './screens/TodoScreen';

export enum MainTab {
  Today,
  Todos,
  Settings
}

export default function App() {
  const [selectedTab, setSelectedTab] = useState<MainTab>(MainTab.Today);

  const renderScreen = () => {
    switch (selectedTab) {
      case MainTab.Today:
        return <View style={styles.placeholder}><Text>Today Screen</Text></View>;
      case MainTab.Todos:
        return <TodosScreen />;
      case MainTab.Settings:
        return <View style={styles.placeholder}><Text>Settings Screen</Text></View>;
      default:
        return <TodosScreen />;
    }
  };

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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