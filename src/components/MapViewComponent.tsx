import React, { useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/constants';

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
  const mapRef = useRef<MapView>(null);

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

  useEffect(() => {
    if (mapRef.current && user) {
      const coordinates = [
        { latitude: launchpad.latitude, longitude: launchpad.longitude },
        { latitude: user.latitude, longitude: user.longitude },
      ];

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [launchpad, user]);

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
        userLocationUpdateInterval={5000}
        userLocationFastestInterval={2000}
      >
        <Marker
          coordinate={{ latitude: launchpad.latitude, longitude: launchpad.longitude }}
          title={launchpad.title || 'Launchpad'}
          description="SpaceX Launch Site"
          pinColor="red"
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
});
