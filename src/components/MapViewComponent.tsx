import React, { useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { View, StyleSheet, Platform } from 'react-native';

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
  
  // Use Google Maps for Android, Apple Maps for iOS
  const mapProvider = Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT;
  
  const region = {
    latitude: launchpad.latitude,
    longitude: launchpad.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  // Fit map to show both launchpad and user location
  useEffect(() => {
    if (mapRef.current && user) {
      const coordinates = [
        { latitude: launchpad.latitude, longitude: launchpad.longitude },
        { latitude: user.latitude, longitude: user.longitude }
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
        {/* Launchpad Marker */}
        <Marker
          coordinate={{ latitude: launchpad.latitude, longitude: launchpad.longitude }}
          title={launchpad.title || 'Launchpad'}
          description="SpaceX Launch Site"
          pinColor="red"
        />
        
        {/* User Location Marker (if coordinates available) */}
        {user && (
          <Marker 
            coordinate={user} 
            pinColor="blue" 
            title="Your Location"
            description="You are here"
            tracksViewChanges={false}
          />
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
});
