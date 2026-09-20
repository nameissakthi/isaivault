import { View, Text } from 'react-native'
import React from 'react'
import { ThemedText, ThemedView } from "../../components/components";
import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <>
        <Stack screenOptions={{
            headerShown : false
        }}>
            <Stack.Screen name='index' options={{
                title : "Root Music Folder Selection"
            }} />
        </Stack>
    </>
  )
}

export default _layout