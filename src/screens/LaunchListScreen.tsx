import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  AppState,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LaunchItem from '../components/LaunchItem';
import Loading from '../components/Loading';
import SearchBar from '../components/SearchBar';
import { useLaunchStore } from '../store/launcheStore';
import { COLORS, SPACING } from '../utils/constants';
import { imagePreloader } from '../utils/imagePreloader';

export default function LaunchListScreen() {
  const insets = useSafeAreaInsets();
  const {
    launches,
    hasNextPage,
    loading,
    loadingMore,
    refreshing,
    error,
    retryCount,
    initLaunches,
    loadMore,
    refreshLaunches,
    retryLaunches,
    searchLaunches,
    clearSearch,
  } = useLaunchStore();

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const previousSearchRef = useRef('');

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setTimeout(() => {
          initLaunches();
        }, 500);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    initLaunches();

    return () => {
      subscription?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (launches.length > 0) {
      const imageUrls = launches
        .map((launch) => launch.links?.patch?.small || launch.links?.patch?.large)
        .filter(Boolean) as string[];

      if (imageUrls.length > 0) {
        imagePreloader.queueForPreload(imageUrls);
      }
    }
  }, [launches]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchQuery !== previousSearchRef.current) {
        previousSearchRef.current = localSearchQuery;

        if (localSearchQuery.trim()) {
          searchLaunches(localSearchQuery);
        } else {
          clearSearch();
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearchQuery]);

  const renderLaunchItem = useCallback(
    ({ item }: { item: any }) => <LaunchItem launch={item} />,
    [],
  );

  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item.id}-${index}`;
  }, []);

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      );
    }

    if (!hasNextPage && launches.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <Text style={styles.noMoreText}>No more launches</Text>
        </View>
      );
    }

    return null;
  };

  const renderEmptyComponent = () => {
    if (loading || refreshing) return null;

    if (error) {
      return (
        <ErrorState
          title="Failed to load launches"
          message={error}
          onRetry={retryLaunches}
          showRetry={retryCount > 0}
        />
      );
    }

    if (localSearchQuery.trim()) {
      return (
        <EmptyState
          icon="search-outline"
          title="No launches found"
          subtitle={`No launches match "${localSearchQuery}". Try a different search term.`}
        />
      );
    }

    return (
      <EmptyState
        icon="rocket-outline"
        title="No launches available"
        subtitle="There are no launches to display at the moment."
      />
    );
  };

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasNextPage && !loading) {
      loadMore();
    }
  }, [loadingMore, hasNextPage, loading, loadMore]);

  const handleRefresh = useCallback(() => {
    refreshLaunches();
  }, [refreshLaunches]);

  if (loading && launches.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
        <View style={styles.container}>
          <SearchBar
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
            placeholder="Search launches..."
            onClear={() => {
              setLocalSearchQuery('');
              clearSearch();
            }}
          />
          <Loading />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <View style={styles.container}>
        <SearchBar
          value={localSearchQuery}
          onChangeText={setLocalSearchQuery}
          placeholder="Search launches..."
          onClear={() => {
            setLocalSearchQuery('');
            clearSearch();
          }}
        />

        <FlatList
          data={launches}
          renderItem={renderLaunchItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={8}
          initialNumToRender={6}
          getItemLayout={undefined}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          updateCellsBatchingPeriod={50}
          disableVirtualization={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToAlignment="start"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: SPACING.sm,
  },
  listContainer: {
    paddingBottom: SPACING['3xl'],
  },
  footerLoader: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  separator: {
    height: SPACING.md,
    backgroundColor: COLORS.background,
  },
  noMoreText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
