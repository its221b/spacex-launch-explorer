import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Alert,
  Platform,
  Linking,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLaunchStore } from '../store/launcheStore';
import MapViewComponent from '../components/MapViewComponent';
import useLocation from '../hooks/useLocation';
import { haversineKm, formatDistance } from '../utils/distanceCalculator';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { selectedLaunchpad, fetchLaunchpadById, selectedLaunchpadId } = useLaunchStore();
  const location = useLocation();
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    if (selectedLaunchpadId) {
      fetchLaunchpadById(selectedLaunchpadId);
    }
  }, [selectedLaunchpadId, fetchLaunchpadById]);

  const distance = useMemo(() => {
    if (!location.coords || !selectedLaunchpad) return null;
    return haversineKm(
      location.coords.latitude,
      location.coords.longitude,
      selectedLaunchpad.latitude,
      selectedLaunchpad.longitude,
    );
  }, [location.coords, selectedLaunchpad]);

  if (!selectedLaunchpadId) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View style={styles.center}>
          <Ionicons name="map" size={64} color={COLORS.textSecondary} />
          <Text style={styles.loadingText}>No Launchpad Selected</Text>
          <Text
            style={[styles.loadingText, { fontSize: TYPOGRAPHY.size.sm, marginTop: SPACING.sm }]}
          >
            Select a launch from the Launches tab to view its location on the map.
          </Text>
        </View>
      </View>
    );
  }

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to show you where you are relative to the launchpad.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionRequested(true);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openDirections = () => {
    if (!selectedLaunchpad) return;

    const { latitude, longitude, name } = selectedLaunchpad;
    const label = encodeURIComponent(name || 'Launchpad');
    const latlng = `${latitude},${longitude}`;

    let url: string;
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?daddr=${latlng}&q=${label}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${latlng}&travelmode=driving`;
    }

    Linking.openURL(url).catch(() => {
      Alert.alert(
        'Navigation Error',
        'Could not open Maps app. Please make sure you have a maps application installed.',
        [{ text: 'OK' }],
      );
    });
  };

  if (!selectedLaunchpad) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading launchpad...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View style={styles.container}>
        <MapViewComponent
          launchpad={{
            latitude: selectedLaunchpad.latitude,
            longitude: selectedLaunchpad.longitude,
            title: selectedLaunchpad.name,
          }}
          user={location.coords ?? undefined}
        />

        <View style={styles.infoCard}>
          <View style={styles.launchpadHeader}>
            <Ionicons name="rocket" size={24} color={COLORS.primary} />
            <Text style={styles.launchpadName}>
              {selectedLaunchpad.full_name || selectedLaunchpad.name}
            </Text>
          </View>

          {selectedLaunchpad.locality && selectedLaunchpad.region && (
            <Text style={styles.launchpadLocation}>
              {selectedLaunchpad.locality}, {selectedLaunchpad.region}
            </Text>
          )}

          {distance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.distanceText}>{formatDistance(distance)} away</Text>
            </View>
          )}

          {!distance && location.coords && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={16} color={COLORS.textSecondary} />
              <Text style={[styles.distanceText, { color: COLORS.textSecondary }]}>
                Calculating distance...
              </Text>
            </View>
          )}

          {!location.coords && !location.loading && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={16} color={COLORS.textSecondary} />
              <Text style={[styles.distanceText, { color: COLORS.textSecondary }]}>
                Enable location to see distance
              </Text>
            </View>
          )}
        </View>

        {location.denied && !permissionRequested && (
          <View style={styles.permissionCard}>
            <View style={styles.permissionHeader}>
              <Ionicons name="location" size={20} color={COLORS.error} />
              <Text style={styles.permissionTitle}>Location Access Required</Text>
            </View>
            <Text style={styles.permissionText}>
              Enable location permissions to see your position and calculate distance to the
              launchpad.
            </Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestLocationPermission}>
              <Text style={styles.permissionButtonText}>Enable Location</Text>
            </TouchableOpacity>
          </View>
        )}

        {location.loading && !location.coords && !location.denied && (
          <View style={styles.permissionCard}>
            <View style={styles.permissionHeader}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.permissionTitle}>Getting Your Location</Text>
            </View>
            <Text style={styles.permissionText}>
              Please wait while we determine your current location...
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.fab} onPress={openDirections}>
          <Ionicons name="navigate" size={26} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
  },
  infoCard: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md,
  },
  launchpadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  launchpadName: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginLeft: SPACING.sm,
    color: COLORS.textPrimary,
    flex: 1,
  },
  launchpadLocation: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xl,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xl,
  },
  distanceText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  permissionCard: {
    position: 'absolute',
    bottom: SPACING.xl + 160,
    left: SPACING.md,
    right: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  permissionTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.error,
    marginLeft: SPACING.sm,
  },
  permissionText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.size.sm * TYPOGRAPHY.lineHeight.normal,
    marginBottom: SPACING.md,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl + 80,
    right: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.lg,
  },
});
