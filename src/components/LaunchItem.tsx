import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Launch } from '../api/types';
import { getLaunchStatus } from '../utils/commonUtils';
import { useImageOptimization } from '../hooks/useImageOptimization';
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  getLaunchStatusStyle,
} from '../utils/constants';

type Props = {
  launch: Launch;
};

const LaunchItem = memo(({ launch }: Props) => {
  const navigation = useNavigation<any>();
  const status = getLaunchStatus(launch);
  const statusStyle = getLaunchStatusStyle(status);

  const { optimizedUrl, isLoading, hasError, isLoaded, retry } = useImageOptimization({
    imageUrl: launch.links?.patch?.small || launch.links?.patch?.large || null,
  });

  const handlePress = useCallback(() => {
    navigation.navigate('LaunchDetail', { id: launch.id });
  }, [navigation, launch.id]);

  const handleRetry = useCallback(() => {
    retry();
  }, [retry]);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {optimizedUrl ? (
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri: optimizedUrl,
                  cache: 'force-cache',
                }}
                style={[styles.image, { opacity: isLoaded ? 1 : 0.3 }]}
                fadeDuration={300}
                resizeMode="contain"
              />

              {isLoading && !isLoaded && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              )}

              {hasError && (
                <TouchableOpacity style={styles.errorOverlay} onPress={handleRetry}>
                  <Text style={styles.errorText}>🚀</Text>
                  <Text style={styles.retryText}>Tap to retry</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>🚀</Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={2}>
            {launch.name}
          </Text>
          <Text style={styles.date} numberOfLines={1}>
            {launch.date_utc ? new Date(launch.date_utc).toLocaleDateString() : 'Unknown date'}
          </Text>
        </View>

        <View style={[styles.badge, statusStyle]}>
          <Text style={[styles.badgeText, { color: statusStyle.color }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

LaunchItem.displayName = 'LaunchItem';

export default LaunchItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: COLORS.gray[100],
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorText: {
    fontSize: TYPOGRAPHY.size.xl,
  },
  retryText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray[200],
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.size.xl,
  },
  details: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  name: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
    minWidth: 60,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
});
