import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform, Linking, AppState } from 'react-native';
import * as Location from 'expo-location';

type PermissionStatus = 'undetermined' | 'granted' | 'denied' | 'blocked';
type Coords = { latitude: number; longitude: number } | null;

export default function useLocation() {
  const [coords, setCoords] = useState<Coords>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const appStateRef = useRef<string>(AppState.currentState);

  const checkPermissionStatus = useCallback(async (): Promise<PermissionStatus> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      let permissionStatus: PermissionStatus;
      if (status === 'granted') {
        permissionStatus = 'granted';
      } else if (status === 'denied') {
        permissionStatus = Platform.OS === 'ios' ? 'blocked' : 'denied';
      } else {
        permissionStatus = 'undetermined';
      }

      setPermissionStatus(permissionStatus);
      return permissionStatus;
    } catch {
      setPermissionStatus('denied');
      setError('Failed to check permission status');
      return 'denied';
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        setError('Location services are disabled on your device');
        return;
      }

      const now = Date.now();
      if (now - lastUpdateTime.current < 30000) {
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30000,
        distanceInterval: 50,
      });

      if (coords) {
        const latDiff = Math.abs(location.coords.latitude - coords.latitude);
        const lngDiff = Math.abs(location.coords.longitude - coords.longitude);

        const latDiffMeters = latDiff * 111000;
        const lngDiffMeters = lngDiff * 111000 * Math.cos((coords.latitude * Math.PI) / 180);

        if (latDiffMeters < 10 && lngDiffMeters < 10) {
          setLoading(false);
          return;
        }
      }

      setCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      lastUpdateTime.current = now;
      setError(null);
    } catch {
      setError('Failed to get current location. Please check your location settings.');
    } finally {
      setLoading(false);
    }
  }, [coords]);

  const requestLocationPermission = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const currentStatus = await checkPermissionStatus();

      if (currentStatus === 'granted') {
        await getCurrentLocation();
        return;
      }

      if (currentStatus === 'blocked') {
        setPermissionStatus('blocked');
        setError('Location access is blocked. Please enable it in device settings.');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setPermissionStatus('granted');
        await getCurrentLocation();
      } else {
        setPermissionStatus('denied');
        setError('Location permission denied');
      }
    } catch {
      setPermissionStatus('denied');
      setError('Failed to request location permission');
      throw new Error('Failed to request location permission');
    } finally {
      setLoading(false);
    }
  }, [checkPermissionStatus, getCurrentLocation]);

  const refreshLocation = useCallback(async (): Promise<void> => {
    if (permissionStatus === 'granted') {
      await getCurrentLocation();
    } else {
      await requestLocationPermission();
    }
  }, [permissionStatus, getCurrentLocation, requestLocationPermission]);

  const openSettings = useCallback((): void => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  const forceRefreshPermissions = useCallback(async (): Promise<void> => {
    await checkPermissionStatus();
    if (permissionStatus === 'granted') {
      await getCurrentLocation();
    }
  }, [checkPermissionStatus, permissionStatus, getCurrentLocation]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        setTimeout(() => {
          forceRefreshPermissions();
        }, 500);
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [forceRefreshPermissions]);

  useEffect(() => {
    const initializeLocation = async () => {
      await checkPermissionStatus();
    };

    initializeLocation();
  }, [checkPermissionStatus]);

  return {
    coords,
    permissionStatus,
    loading,
    error,
    refreshLocation,
    requestLocationPermission,
    checkPermissionStatus,
    forceRefreshPermissions,
    openSettings,
  };
}
