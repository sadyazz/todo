import React, { useState } from 'react'
import { Pressable, View, Text, LayoutChangeEvent } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useTheme } from '../contexts/ThemeContext'

export type TabButtonType = {
    title:string
}

type TabButtonProps = {
    buttons: TabButtonType[]
    selectedTab: number
    setSelectedTab: (index : number)=>void
}


const TabButtons = ({buttons, selectedTab, setSelectedTab}: TabButtonProps) => {
    const { isDark } = useTheme();
    const [dimentions, setDimentions] = useState({height: 20, width: 100})
    const buttonWidth = dimentions.width / buttons.length;

    const tabPositionX = useSharedValue(0);

    const onTabbarLayout = (e:LayoutChangeEvent)=>{
        setDimentions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        });
    }

    const handlePress = (index:number)=>{
        setSelectedTab(index);
    }

    const onTabPress = (index:number) =>{
        tabPositionX.value = withTiming(buttonWidth * index, {}, ()=>{
            runOnJS(handlePress)(index);
        })
    }

    const animatedStyle = useAnimatedStyle(()=>{
        return {
            transform: [{translateX: tabPositionX.value}]
        }
    })

  return (
    <View
    accessibilityRole="tabbar"
    style={{
            backgroundColor:"#c333cc",
            borderRadius: 20,
            justifyContent:"center",
        }}>
        <Animated.View style={[animatedStyle, {position:'absolute', backgroundColor: isDark ? '#1a1a1a' : '#fff', borderRadius: 15, marginHorizontal: 5, height: dimentions.height - 10, width: buttonWidth - 10 }]}/>
        <View onLayout={onTabbarLayout} style={{flexDirection:'row'}}>
            {buttons.map((button, index)=>{
                const color = selectedTab === index ? '#c333cc': (isDark ? '#fff' : '#fff');
                return (
                    <Pressable key={index} onPress={()=>onTabPress(index)} style={{flex: 1, paddingVertical: 20}}>
                        <Text style={{color:color, alignSelf:'center', fontWeight:'600', fontSize: 14}}>{button.title}</Text>
                    </Pressable>
                )
            })}
        </View>
    </View>
  )
}

export default TabButtons