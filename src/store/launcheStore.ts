import { create } from 'zustand';
import { getLaunches, getLaunchpadById } from '../api/launches';
import { Launch, Launchpad } from '../api/types';
import { logError, logInfo, logWarn } from '../utils/logger';

type State = {
  launches: Launch[];
  originalLaunches: Launch[];
  hasNextPage: boolean;
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  searchQuery: string;
  currentPage: number;

  selectedLaunchpad: Launchpad | null;
  selectedLaunchpadId: string | null;
};

type Actions = {
  initLaunches: () => Promise<void>;
  loadMore: () => Promise<void>;
  refreshLaunches: () => Promise<void>;
  searchLaunches: (query: string) => Promise<void>;
  clearSearch: () => Promise<void>;
  retryLaunches: () => Promise<void>;

  fetchLaunchpadById: (id: string) => Promise<void>;
  setSelectedLaunchpadId: (id: string | null) => void;
  clearError: () => void;
  clearSelectedLaunchpadId: () => void;
};

export const useLaunchStore = create<State & Actions>((set, get) => {
  const ensureUniqueLaunches = (launches: Launch[]): Launch[] => {
    const seen = new Set();
    return launches.filter((launch) => {
      if (seen.has(launch.id)) {
        return false;
      }
      seen.add(launch.id);
      return true;
    });
  };

  return {
    launches: [],
    originalLaunches: [],
    hasNextPage: false,
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
    retryCount: 0,
    maxRetries: 3,
    searchQuery: '',
    currentPage: 1,

    selectedLaunchpad: null,
    selectedLaunchpadId: null,

    initLaunches: async () => {
      const currentLaunches = get().launches;
      const currentSearchQuery = get().searchQuery;

      if (currentLaunches.length > 0 && !currentSearchQuery && get().hasNextPage !== false) return;

      set({ loading: true, error: null, currentPage: 1 });
      try {
        logInfo('Initializing launches');
        const data = await getLaunches(1, 10);
        const uniqueLaunches = ensureUniqueLaunches(data.docs);
        set({
          launches: uniqueLaunches,
          originalLaunches: uniqueLaunches,
          hasNextPage: data.hasNextPage,
          loading: false,
          retryCount: 0,
          currentPage: 1,
        });
        logInfo(`Loaded ${uniqueLaunches.length} launches, hasNextPage: ${data.hasNextPage}`);
      } catch (error: any) {
        const { retryCount, maxRetries } = get();
        const newRetryCount = retryCount + 1;

        if (newRetryCount <= maxRetries) {
          logWarn(`Launch fetch failed, retrying ${newRetryCount}/${maxRetries}`);
          set({
            retryCount: newRetryCount,
            loading: false,
            error: `Failed to fetch launches. Retrying... (${newRetryCount}/${maxRetries})`,
          });

          setTimeout(() => {
            get().initLaunches();
          }, 2000);
        } else {
          const errorMessage =
            error.message || 'Failed to fetch launches. Please check your internet connection.';
          logError(errorMessage, error as Error);
          set({
            error: errorMessage,
            loading: false,
            retryCount: 0,
          });
        }
      }
    },

    loadMore: async () => {
      const { loadingMore, hasNextPage, currentPage, searchQuery } = get();

      if (loadingMore || !hasNextPage || searchQuery.trim()) {
        return;
      }

      set({ loadingMore: true });
      try {
        const nextPage = currentPage + 1;
        const data = await getLaunches(nextPage, 10);

        const existingIds = new Set(get().launches.map((launch) => launch.id));
        const newLaunches = data.docs.filter((launch) => !existingIds.has(launch.id));

        if (newLaunches.length > 0) {
          set((state) => ({
            launches: ensureUniqueLaunches([...state.launches, ...newLaunches]),
            originalLaunches: ensureUniqueLaunches([...state.originalLaunches, ...newLaunches]),
            hasNextPage: data.hasNextPage,
            loadingMore: false,
            currentPage: nextPage,
          }));

          logInfo(
            `Loaded more launches: page ${nextPage}, added ${newLaunches.length} new launches`,
          );
        } else {
          set({ hasNextPage: false, loadingMore: false });
          logInfo('No more launches to load - reached end of data');
        }
      } catch (error: any) {
        logError('Failed to load more launches', error as Error);
        set({ loadingMore: false });
      }
    },

    searchLaunches: async (query: string) => {
      const originalLaunches = get().originalLaunches;
      const currentSearchQuery = get().searchQuery;
      const searchTerm = query.toLowerCase().trim();

      if (currentSearchQuery === query) {
        return;
      }

      if (!searchTerm) {
        set({
          launches: originalLaunches,
          searchQuery: '',
          currentPage: 1,
          loading: false,
          error: null,
          hasNextPage: get().hasNextPage,
        });
        return;
      }

      set({ loading: true, error: null, searchQuery: query, currentPage: 1 });

      try {
        const filteredLaunches = originalLaunches.filter((launch) =>
          launch.name.toLowerCase().includes(searchTerm),
        );

        set({
          launches: filteredLaunches,
          hasNextPage: false,
          loading: false,
          retryCount: 0,
          currentPage: 1,
        });

        logInfo(`Local search results: ${filteredLaunches.length} launches found for "${query}"`);
      } catch (error: any) {
        const errorMessage = 'Search failed. Please try again.';
        logError(errorMessage, error as Error);
        set({ error: errorMessage, loading: false });
      }
    },

    clearSearch: async () => {
      const originalLaunches = get().originalLaunches;

      set({
        launches: originalLaunches,
        searchQuery: '',
        currentPage: 1,
        loading: false,
        error: null,
        hasNextPage: get().hasNextPage,
      });
    },

    retryLaunches: async () => {
      set({ retryCount: 0, error: null });
      await get().initLaunches();
    },

    refreshLaunches: async () => {
      set({ refreshing: true, error: null, retryCount: 0, currentPage: 1 });
      try {
        logInfo('Refreshing launches');
        const data = await getLaunches(1, 10);
        const uniqueLaunches = ensureUniqueLaunches(data.docs);
        set({
          launches: uniqueLaunches,
          hasNextPage: data.hasNextPage,
          refreshing: false,
          retryCount: 0,
          currentPage: 1,
        });
        logInfo(`Refreshed ${uniqueLaunches.length} launches`);
      } catch (error: any) {
        const errorMessage =
          error.message || 'Failed to refresh launches. Please check your internet connection.';
        logError(errorMessage, error as Error);
        set({ error: errorMessage, refreshing: false });
      }
    },

    fetchLaunchpadById: async (id: string) => {
      try {
        logInfo(`Fetching launchpad: ${id}`);
        const pad = await getLaunchpadById(id);
        if (pad && typeof pad.latitude === 'number' && typeof pad.longitude === 'number') {
          set({ selectedLaunchpad: pad });
          logInfo(`Loaded launchpad: ${pad.name}`);
        } else {
          const errorMessage = 'Launchpad not found or missing coordinates.';
          logError(errorMessage);
          set({ error: errorMessage });
        }
      } catch (error: any) {
        const errorMessage =
          error.message || 'Failed to load launchpad. Please check your internet connection.';
        logError(errorMessage, error as Error);
        set({ error: errorMessage });
      }
    },

    setSelectedLaunchpadId: (id) => set({ selectedLaunchpadId: id }),
    clearSelectedLaunchpadId: () => set({ selectedLaunchpadId: null, selectedLaunchpad: null }),
    clearError: () => set({ error: null, retryCount: 0 }),
  };
});
