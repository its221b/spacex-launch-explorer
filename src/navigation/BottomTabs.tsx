import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LaunchListScreen from '../screens/LaunchListScreen';
import MapScreen from '../screens/MapScreen';
import { COLORS } from '../utils/constants';
import { BottomTabParamList } from './types';
import { useLaunchStore } from '../store/launcheStore';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  const { clearSelectedLaunchpadId } = useLaunchStore();

  const handleTabPress = (tabName: 'Launches' | 'Map') => {
    if (tabName === 'Launches') {
      clearSelectedLaunchpadId();
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Launches') {
            iconName = focused ? 'rocket' : 'rocket-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 16),
          paddingTop: 8,
          height: 60 + Math.max(insets.bottom, 16),
          elevation: 8,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: false,
      })}
      initialRouteName="Launches"
      screenListeners={{
        tabPress: (e) => {
          const routeName = e.target?.split('-')[0];
          if (routeName === 'Launches') {
            handleTabPress('Launches');
          }
        },
      }}
    >
      <Tab.Screen
        name="Launches"
        component={LaunchListScreen}
        options={{
          title: 'Launches',
          tabBarLabel: 'Launches',
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Map',
          tabBarLabel: 'Map',
        }}
      />
    </Tab.Navigator>
  );
}
