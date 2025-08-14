import React, { useEffect, useState } from 'react';
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
  const { selectedLaunchpadId, clearSelectedLaunchpadId } = useLaunchStore();
  const [tabKey, setTabKey] = useState('launches');

  useEffect(() => {
    if (selectedLaunchpadId) {
      // Force switch to Map tab by changing the key
      setTabKey('map');
    }
  }, [selectedLaunchpadId]);

  const handleTabPress = (tabName: 'Launches' | 'Map') => {
    if (tabName === 'Launches') {
      // Clear selected launchpad when user goes back to Launches tab
      clearSelectedLaunchpadId();
      setTabKey('launches');
    }
  };

  return (
    <Tab.Navigator
      key={tabKey}
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
      initialRouteName={tabKey === 'map' ? 'Map' : 'Launches'}
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
