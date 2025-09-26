import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import TabButtons, { TabButtonType } from './components/TabButtons';
import { DatabaseProvider } from './providers/DatabaseProvider';

export enum CustomTab{
    Tab1, Tab2
}

export default function App() {
  const [selectedTab, setSelectedTab] = useState<CustomTab>(CustomTab.Tab1)

  const buttons:TabButtonType[]=[
      {title: "Tab 1"},
      {title: "Tab 2"}

  ]
  return (
    <DatabaseProvider>
      <View style={{paddingHorizontal: 15}}>
        <SafeAreaView>
          <TabButtons
            buttons={buttons}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          <View style={localStyles.container}>
            {selectedTab === CustomTab.Tab1 ? (
              <Text>tab 1 content</Text>
            ): (
              <Text>tab 2 content</Text>
            )}
          </View>
        </SafeAreaView>
      </View>
    </DatabaseProvider>
  )
}


const localStyles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop: 20,
      alignItems: 'center'
  }
})
