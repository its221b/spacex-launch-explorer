import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/navigation/RootStack';
import ErrorBoundary from './src/components/ErrorBoundary';
import { validateEnvironment } from './src/config/env';

export default function App() {
  useEffect(() => {
    try {
      validateEnvironment();
    } catch (error) {
      console.warn('Environment validation failed:', error);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
