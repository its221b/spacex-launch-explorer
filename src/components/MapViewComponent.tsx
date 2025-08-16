import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Linking, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { logError } from '../utils/logger';

let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

try {
  const mapsModule = require('react-native-maps');
  MapView = mapsModule.default;
  Marker = mapsModule.Marker;
  PROVIDER_GOOGLE = mapsModule.PROVIDER_GOOGLE;
} catch (error) {
  logError('Failed to load React Native Maps module', error as Error);
  MapView = null;
  Marker = null;
  PROVIDER_GOOGLE = null;
}

type LaunchpadMarker = {
  latitude: number;
  longitude: number;
  title?: string;
};

export default function MapViewComponent({
  launchpad,
  user,
}: {
  launchpad: LaunchpadMarker;
  user?: { latitude: number; longitude: number };
}) {
  const mapRef = useRef<any>(null);
  const lastRegionRef = useRef<any>(null);

  const mapProvider = Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;

  const region = useMemo(() => {
    if (user) {
      const centerLat = (launchpad.latitude + user.latitude) / 2;
      const centerLng = (launchpad.longitude + user.longitude) / 2;

      const latDiff = Math.abs(launchpad.latitude - user.latitude);
      const lngDiff = Math.abs(launchpad.longitude - user.longitude);

      const latitudeDelta = Math.max(latDiff * 2, 0.05);
      const longitudeDelta = Math.max(lngDiff * 2, 0.05);

      return {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta,
        longitudeDelta,
      };
    } else {
      return {
        latitude: launchpad.latitude,
        longitude: launchpad.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }
  }, [launchpad, user]);

  const shouldUpdateRegion = useCallback((newRegion: any) => {
    if (!lastRegionRef.current) return true;

    const current = lastRegionRef.current;
    const latDiff = Math.abs(newRegion.latitude - current.latitude);
    const lngDiff = Math.abs(newRegion.longitude - current.longitude);
    const latDeltaDiff = Math.abs(newRegion.latitudeDelta - current.latitudeDelta);
    const lngDeltaDiff = Math.abs(newRegion.longitudeDelta - current.longitudeDelta);

    return latDiff > 0.001 || lngDiff > 0.001 || latDeltaDiff > 0.001 || lngDeltaDiff > 0.001;
  }, []);

  useEffect(() => {
    if (mapRef.current && shouldUpdateRegion(region)) {
      if (user) {
        const coordinates = [
          { latitude: launchpad.latitude, longitude: launchpad.longitude },
          { latitude: user.latitude, longitude: user.longitude },
        ];

        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } else {
        mapRef.current.animateToRegion(region, 1000);
      }
      lastRegionRef.current = region;
    }
  }, [launchpad, user, region, shouldUpdateRegion]);

  const handleRegionChangeComplete = useCallback((newRegion: any) => {
    lastRegionRef.current = newRegion;
  }, []);

  if (!MapView || !Marker) {
    return (
      <View style={styles.fallbackContainer}>
        <View style={styles.fallbackContent}>
          <Ionicons name="map" size={64} color={COLORS.textSecondary} />
          <Text style={styles.fallbackTitle}>Map Not Available</Text>
          <Text style={styles.fallbackText}>
            This feature requires a development build of the app.
          </Text>

          <View style={styles.coordinatesContainer}>
            <View style={styles.coordinateItem}>
              <Text style={styles.coordinateLabel}>Launchpad:</Text>
              <Text style={styles.coordinateValue}>
                {launchpad.latitude.toFixed(4)}, {launchpad.longitude.toFixed(4)}
              </Text>
            </View>

            {user && (
              <View style={styles.coordinateItem}>
                <Text style={styles.coordinateLabel}>Your Location:</Text>
                <Text style={styles.coordinateValue}>
                  {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.openMapsButton}
            onPress={() => {
              const url =
                Platform.OS === 'ios'
                  ? `http://maps.apple.com/?q=${launchpad.latitude},${launchpad.longitude}`
                  : `https://www.google.com/maps?q=${launchpad.latitude},${launchpad.longitude}`;

              Linking.openURL(url).catch((error) => {
                logError('Failed to open Maps app', error as Error);
                Alert.alert('Error', 'Could not open Maps app');
              });
            }}
          >
            <Ionicons name="navigate" size={20} color={COLORS.white} />
            <Text style={styles.openMapsText}>Open in Maps App</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        mapType="standard"
        provider={mapProvider}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={true}
        followsUserLocation={false}
        userLocationPriority="high"
        userLocationUpdateInterval={10000}
        userLocationFastestInterval={5000}
        onRegionChangeComplete={handleRegionChangeComplete}
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        moveOnMarkerPress={false}
        tracksViewChanges={false}
        liteMode={false}
        animationEnabled={true}
        toolbarEnabled={false}
        keepAlive={true}
      >
        <Marker
          coordinate={{ latitude: launchpad.latitude, longitude: launchpad.longitude }}
          title={launchpad.title || 'Launchpad'}
          description="SpaceX Launch Site"
          pinColor="red"
          tracksViewChanges={false}
        />

        <Marker
          coordinate={{
            latitude: launchpad.latitude + 0.005,
            longitude: launchpad.longitude,
          }}
          tracksViewChanges={false}
        >
          <View style={[styles.markerLabel, { backgroundColor: COLORS.map.launchpad }]}>
            <Text style={styles.markerText}>{launchpad.title || 'Launchpad'}</Text>
          </View>
        </Marker>

        {user && (
          <Marker
            coordinate={user}
            pinColor="blue"
            title="Your Location"
            description="You are here"
            tracksViewChanges={false}
          />
        )}

        {user && (
          <Marker
            coordinate={{
              latitude: user.latitude + 0.005,
              longitude: user.longitude,
            }}
            tracksViewChanges={false}
          >
            <View style={[styles.markerLabel, { backgroundColor: COLORS.map.userLocation }]}>
              <Text style={styles.markerText}>Your Location</Text>
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerLabel: {
    backgroundColor: COLORS.map.launchpad,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  markerText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  fallbackContent: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  fallbackTitle: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  fallbackText: {
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  coordinatesContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  coordinateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  coordinateLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  coordinateValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  openMapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
  },
  openMapsText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    marginLeft: SPACING.sm,
  },
});
