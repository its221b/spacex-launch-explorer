import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LaunchDetailScreen from '../screens/LaunchDetailScreen';
import BottomTabs from './BottomTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="LaunchDetail"
        component={LaunchDetailScreen}
        options={{ title: 'Launch Details' }}
      />
    </Stack.Navigator>
  );
}
