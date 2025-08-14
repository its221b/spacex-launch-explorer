import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';

type Coords = { latitude: number; longitude: number } | null;

export default function useLocation() {
  const [coords, setCoords] = useState<Coords>(null);
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check current permission status
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        // Permission already granted, get location
        await getCurrentLocation();
        return;
      }
      
      if (existingStatus === 'denied') {
        // Permission denied, request it
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          await getCurrentLocation();
        } else {
          setDenied(true);
          setError('Location permission denied');
        }
      }
      
      if (existingStatus === 'undetermined') {
        // Permission not determined yet, request it
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          await getCurrentLocation();
        } else {
          setDenied(true);
          setError('Location permission denied');
        }
      }
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError('Failed to request location permission');
      setDenied(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 10,
      });
      
      setCoords({ 
        latitude: location.coords.latitude, 
        longitude: location.coords.longitude 
      });
      setDenied(false);
      setError(null);
    } catch (err) {
      console.error('Error getting current location:', err);
      setError('Failed to get current location');
      setDenied(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  const refreshLocation = async () => {
    if (!denied) {
      await getCurrentLocation();
    }
  };

  return { 
    coords, 
    denied, 
    loading, 
    error, 
    refreshLocation,
    requestLocationPermission 
  };
}
