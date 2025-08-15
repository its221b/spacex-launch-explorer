import React, { useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  Platform,
  Linking,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useLaunchStore } from '../store/launcheStore';
import MapViewComponent from '../components/MapViewComponent';
import useLocation from '../hooks/useLocation';
import { haversineKm, formatDistanceWithPlural } from '../utils/distanceCalculator';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { selectedLaunchpad, fetchLaunchpadById, selectedLaunchpadId } = useLaunchStore();
  const location = useLocation();

  useEffect(() => {
    if (selectedLaunchpadId) {
      fetchLaunchpadById(selectedLaunchpadId);
    }
  }, [selectedLaunchpadId, fetchLaunchpadById]);

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      const refreshPermissions = async () => {
        if (isMounted) {
          await location.forceRefreshPermissions();
        }
      };

      const timeoutId = setTimeout(refreshPermissions, 1000);

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }, [location]),
  );

  const distance = useMemo(() => {
    if (!location.coords || !selectedLaunchpad) return null;
    return haversineKm(
      location.coords.latitude,
      location.coords.longitude,
      selectedLaunchpad.latitude,
      selectedLaunchpad.longitude,
    );
  }, [location.coords, selectedLaunchpad]);

  const formattedDistance = useMemo(() => {
    if (!distance) return null;
    return formatDistanceWithPlural(distance);
  }, [distance]);

  const openDirections = useCallback(() => {
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
  }, [selectedLaunchpad]);

  const launchpadData = useMemo(() => {
    if (!selectedLaunchpad) return null;

    return {
      latitude: selectedLaunchpad.latitude,
      longitude: selectedLaunchpad.longitude,
      title: selectedLaunchpad.name,
    };
  }, [selectedLaunchpad]);

  const handleRetryPermission = useCallback(async () => {
    try {
      await location.requestLocationPermission();
    } catch {
      location.openSettings();
    }
  }, [location]);

  if (!selectedLaunchpadId) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View style={styles.center}>
          <Ionicons name="map" size={64} color={COLORS.textSecondary} />
          <Text style={styles.loadingText}>Welcome to Launchpad Map</Text>
          <Text style={styles.instructionText}>
            Select a launch from the Launches tab to view its location on the map.
          </Text>
        </View>
      </View>
    );
  }

  if (!selectedLaunchpad) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading launchpad...</Text>
          <Text style={styles.loadingSubtext}>
            Please wait while we fetch the launchpad data...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View style={styles.container}>
        <MapViewComponent launchpad={launchpadData!} user={location.coords ?? undefined} />

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

          {formattedDistance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.distanceText}>
                {formattedDistance} from your current location
              </Text>
            </View>
          )}

          {!formattedDistance && location.permissionStatus === 'granted' && location.loading && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={16} color={COLORS.textSecondary} />
              <Text style={[styles.distanceText, { color: COLORS.textSecondary }]}>
                Calculating distance...
              </Text>
            </View>
          )}

          {!formattedDistance &&
            location.permissionStatus === 'granted' &&
            !location.coords &&
            !location.loading && (
              <View style={styles.distanceContainer}>
                <Ionicons name="location" size={16} color={COLORS.textSecondary} />
                <Text style={[styles.distanceText, { color: COLORS.textSecondary }]}>
                  Location not available
                </Text>
              </View>
            )}

          {location.permissionStatus !== 'granted' && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={16} color={COLORS.textSecondary} />
              <Text style={[styles.distanceText, { color: COLORS.textSecondary }]}>
                Enable location to see distance
              </Text>
            </View>
          )}
        </View>

        {location.permissionStatus === 'undetermined' && (
          <View style={styles.permissionCardCentered}>
            <View style={styles.permissionHeader}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <Text style={styles.permissionTitle}>Enable Location Access</Text>
            </View>
            <Text style={styles.permissionText}>
              This app needs location access to show your position on the map and calculate distance
              to SpaceX launchpads. Please grant location permission to use all map features.
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={location.requestLocationPermission}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        )}

        {location.permissionStatus === 'denied' && (
          <View style={styles.permissionCardCentered}>
            <View style={styles.permissionHeader}>
              <Ionicons name="location" size={20} color={COLORS.error} />
              <Text style={styles.permissionTitle}>Location Access Required</Text>
            </View>
            <Text style={styles.permissionText}>
              This app needs location access to show your position on the map and calculate distance
              to launchpads. Without location access, you won't be able to see how far you are from
              SpaceX launch sites.
            </Text>
            <View style={styles.permissionButtonContainer}>
              <TouchableOpacity style={styles.permissionButton} onPress={handleRetryPermission}>
                <Text style={styles.permissionButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.permissionButton, styles.settingsButton]}
                onPress={location.openSettings}
              >
                <Text style={styles.permissionButtonText}>Open Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {location.permissionStatus === 'blocked' && (
          <View style={styles.permissionCardCentered}>
            <View style={styles.permissionHeader}>
              <Ionicons name="location" size={20} color={COLORS.warning} />
              <Text style={styles.permissionTitle}>Location Access Blocked</Text>
            </View>
            <Text style={styles.permissionText}>
              Location access is blocked on your device. You need to enable location permissions in
              your device settings to use map features and see your distance to launchpads.
            </Text>
            <View style={styles.permissionButtonContainer}>
              <TouchableOpacity style={styles.permissionButton} onPress={handleRetryPermission}>
                <Text style={styles.permissionButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.permissionButton, styles.settingsButton]}
                onPress={location.openSettings}
              >
                <Text style={styles.permissionButtonText}>Open Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {location.permissionStatus === 'granted' && location.loading && !location.coords && (
          <View style={styles.loadingCard}>
            <View style={styles.loadingHeader}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingTitle}>Getting Your Location</Text>
            </View>
            <Text style={styles.loadingText}>
              Please wait while we determine your current location...
            </Text>
          </View>
        )}

        {location.permissionStatus === 'granted' && location.error && !location.coords && (
          <View style={styles.errorCard}>
            <View style={styles.errorHeader}>
              <Ionicons name="location" size={20} color={COLORS.warning} />
              <Text style={styles.errorTitle}>Location Error</Text>
            </View>
            <Text style={styles.errorText}>
              {location.error}. Please try again or check your location settings.
            </Text>
            <View style={styles.errorButtonContainer}>
              <TouchableOpacity style={styles.errorButton} onPress={location.refreshLocation}>
                <Text style={styles.errorButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.errorButton, styles.settingsButton]}
                onPress={location.openSettings}
              >
                <Text style={styles.errorButtonText}>Open Settings</Text>
              </TouchableOpacity>
            </View>
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
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  instructionText: {
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  fab: {
    position: 'absolute',
    bottom: SPACING.xl + 80,
    right: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.lg,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginLeft: SPACING.xl,
  },
  distanceText: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.primary,
  },
  permissionCardCentered: {
    position: 'absolute',
    top: '50%',
    left: SPACING.lg,
    right: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md,
    marginTop: SPACING.md,
    alignItems: 'center',
    transform: [{ translateY: -100 }],
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  permissionTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginLeft: SPACING.sm,
    color: COLORS.textPrimary,
  },
  permissionText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.sm,
    minWidth: 80,
    flex: 1,
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    textAlign: 'center',
  },
  permissionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    width: '100%',
    gap: SPACING.xs,
  },
  settingsButton: {
    backgroundColor: COLORS.secondary,
  },
  loadingCard: {
    position: 'absolute',
    top: '50%',
    left: SPACING.lg,
    right: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md,
    marginTop: SPACING.md,
    alignItems: 'center',
    transform: [{ translateY: -100 }],
  },
  loadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  loadingTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginLeft: SPACING.sm,
    color: COLORS.textPrimary,
  },
  errorCard: {
    position: 'absolute',
    top: '50%',
    left: SPACING.lg,
    right: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md,
    marginTop: SPACING.md,
    alignItems: 'center',
    transform: [{ translateY: -100 }],
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginLeft: SPACING.sm,
    color: COLORS.textPrimary,
  },
  errorText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  errorButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    width: '100%',
    gap: SPACING.xs,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.sm,
    minWidth: 80,
    flex: 1,
  },
  errorButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    textAlign: 'center',
  },
});
