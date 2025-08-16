import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useLaunchStore } from '../store/launcheStore';
import { logError } from '../utils/logger';
import { getLaunchStatus } from '../utils/commonUtils';
import { getLaunchById, getLaunchpadById } from '../api/launches';
import { Launch, Launchpad } from '../api/types';
import { RootStackParamList } from '../navigation/types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, getLaunchStatusStyle } from '../utils/constants';
import { useImageOptimization } from '../hooks/useImageOptimization';

type Props = NativeStackScreenProps<RootStackParamList, 'LaunchDetail'>;

export default function LaunchDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [launchpad, setLaunchpad] = useState<Launchpad | null>(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedLaunchpadId } = useLaunchStore();

  const { optimizedUrl, isLoading, hasError, isLoaded, retry } = useImageOptimization({
    imageUrl: launch?.links?.patch?.large || null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const launchData = await getLaunchById(id);
        setLaunch(launchData);

        if (launchData?.launchpad) {
          const launchpadData = await getLaunchpadById(launchData.launchpad);
          setLaunchpad(launchpadData);
        }
      } catch (error) {
        logError('Failed to load launch details', error as Error);
        Alert.alert('Error', 'Failed to load launch details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const openWikipedia = () => {
    if (launch?.links?.wikipedia) {
      Linking.openURL(launch.links.wikipedia).catch((error) => {
        logError('Failed to open Wikipedia link', error as Error);
        Alert.alert('Error', 'Could not open Wikipedia');
      });
    }
  };

  const openMap = () => {
    if (launch?.launchpad) {
      setSelectedLaunchpadId(launch.launchpad);
      navigation.navigate('Main', { screen: 'Map', params: { launchpadId: launch.launchpad } });
    }
  };

  if (loading || !launch) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const status = getLaunchStatus(launch);
  const statusStyle = getLaunchStatusStyle(status);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {launch.links?.patch?.large && (
          <View style={styles.patchContainer}>
            {isLoading && !isLoaded && (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.imageLoadingText}>Loading image...</Text>
              </View>
            )}
            
            {hasError && (
              <TouchableOpacity style={styles.imageErrorContainer} onPress={retry}>
                <Ionicons name="refresh" size={32} color={COLORS.error} />
                <Text style={styles.imageErrorText}>Image failed to load</Text>
                <Text style={styles.imageRetryText}>Tap to retry</Text>
              </TouchableOpacity>
            )}
            
            {!hasError && (
              <Image 
                source={{ uri: optimizedUrl || launch.links.patch.large }} 
                style={[styles.patch, { opacity: isLoaded ? 1 : 0.3 }]}
                fadeDuration={300}
                resizeMode="contain"
              />
            )}
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{launch.name}</Text>

          <View style={styles.dateContainer}>
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
            <Text style={styles.date}>
              {launch.date_utc
                ? new Date(launch.date_utc).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Unknown date'}
            </Text>
          </View>

          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>

          {launch.details && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mission Details</Text>
              <Text style={styles.details}>{launch.details}</Text>
            </View>
          )}

          {launchpad && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Launchpad Information</Text>
              <View style={styles.launchpadInfo}>
                <View style={styles.launchpadHeader}>
                  <Ionicons name="rocket" size={20} color={COLORS.primary} />
                  <Text style={styles.launchpadName}>{launchpad.full_name || launchpad.name}</Text>
                </View>
                {launchpad.locality && launchpad.region && (
                  <View style={styles.launchpadLocationContainer}>
                    <Ionicons name="location" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.launchpadLocation}>
                      {launchpad.locality}, {launchpad.region}
                    </Text>
                  </View>
                )}
                {launchpad.details && (
                  <View style={styles.launchpadDetailsContainer}>
                    <Text style={styles.launchpadDetails}>{launchpad.details}</Text>
                  </View>
                )}
                {launchpad.latitude && launchpad.longitude && (
                  <View style={styles.coordinatesContainer}>
                    <Ionicons name="map" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.coordinates}>
                      {launchpad.latitude.toFixed(4)}, {launchpad.longitude.toFixed(4)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {launch.links?.wikipedia && (
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={openWikipedia}
              >
                <Ionicons name="open-outline" size={20} color={COLORS.white} />
                <Text style={styles.buttonText}>Open Wikipedia</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={openMap}>
              <Ionicons name="map-outline" size={20} color={COLORS.white} />
              <Text style={styles.buttonText}>View on Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.size.lg,
    color: COLORS.textSecondary,
  },
  patchContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.md,
  },
  patch: {
    width: SPACING.xl * 10,
    height: SPACING.xl * 10,
    borderRadius: BORDER_RADIUS.lg,
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    zIndex: 1,
  },
  imageLoadingText: {
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  imageErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    zIndex: 1,
  },
  imageErrorText: {
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.error,
    textAlign: 'center',
  },
  imageRetryText: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  infoContainer: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.size['2xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  date: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  statusText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  details: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.size.sm * TYPOGRAPHY.lineHeight.normal,
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.xs,
  },
  launchpadInfo: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    minHeight: SPACING.xl * 4,
  },
  launchpadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  launchpadName: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  launchpadLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  launchpadLocation: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  launchpadDetailsContainer: {
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  launchpadDetails: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.size.sm * TYPOGRAPHY.lineHeight.normal,
    textAlign: 'left',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.xs,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinates: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: SPACING.xl * 7,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderRadius: BORDER_RADIUS.md,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginLeft: SPACING.xs,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
});
