import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
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
    searchQuery,
    initLaunches,
    loadMore,
    refreshLaunches,
    retryLaunches,
    searchLaunches,
    clearSearch,
  } = useLaunchStore();

  const [localSearchQuery, setLocalSearchQuery] = useState('');

  useEffect(() => {
    initLaunches();
  }, [initLaunches]);

  // Preload images when launches change
  useEffect(() => {
    if (launches.length > 0) {
      const imageUrls = launches
        .map(launch => launch.links?.patch?.small || launch.links?.patch?.large)
        .filter(Boolean) as string[];
      
      if (imageUrls.length > 0) {
        // Queue images for background preloading
        imagePreloader.queueForPreload(imageUrls);
      }
    }
  }, [launches]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        if (localSearchQuery.trim()) {
          searchLaunches(localSearchQuery);
        } else {
          clearSearch();
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, searchQuery, searchLaunches, clearSearch]);

  const renderLaunchItem = useCallback(
    ({ item }: { item: any }) => <LaunchItem launch={item} />,
    [],
  );

  const keyExtractor = useCallback((item: any, index: number) => {
    // Use both ID and index to ensure unique keys
    return `${item.id}-${index}`;
  }, []);

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;

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
        subtitle="There are currently no launches to display. Check back later!"
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
    return <Loading />;
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
          onEndReachedThreshold={0.1}
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
          maxToRenderPerBatch={8} // Reduced for better performance
          windowSize={8} // Reduced window size
          initialNumToRender={6} // Reduced initial render
          getItemLayout={undefined}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          // Additional performance optimizations
          updateCellsBatchingPeriod={50}
          disableVirtualization={false}
          scrollEventThrottle={16} // 60fps scrolling
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
});
