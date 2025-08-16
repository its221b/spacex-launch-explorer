import { create } from 'zustand';
import { getLaunches, getLaunchpadById } from '../api/launches';
import { Launch, Launchpad } from '../api/types';
import { logError } from '../utils/logger';

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

export const useLaunchStore = create<State & Actions>((set, get) => ({
  launches: [],
  originalLaunches: [],
  hasNextPage: false,
  loading: false,
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
    const { retryCount, maxRetries } = get();
    if (retryCount >= maxRetries) {
      set({ error: 'Maximum retry attempts reached. Please check your connection.' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const data = await getLaunches(1, 1000);
      const allLaunches = ensureUniqueLaunches(data.docs);
      const { pageData, hasNextPage: hasMore } = paginateLaunches(allLaunches, 1, 10);

      set({
        launches: pageData,
        originalLaunches: allLaunches,
        hasNextPage: hasMore,
        loading: false,
        retryCount: 0,
        currentPage: 1,
      });
    } catch (error: any) {
      const newRetryCount = retryCount + 1;
      logError('Failed to fetch launches', error as Error);
      set({
        error: 'Failed to load launches. Please check your connection and try again.',
        loading: false,
        retryCount: newRetryCount,
      });
    }
  },

  loadMore: async () => {
    const { currentPage, originalLaunches, hasNextPage } = get();
    if (!hasNextPage || get().loadingMore) return;

    set({ loadingMore: true });

    try {
      const nextPage = currentPage + 1;
      const { pageData, hasNextPage: hasMore } = paginateLaunches(originalLaunches, nextPage, 10);

      if (pageData.length > 0) {
        set((state) => ({
          launches: [...state.launches, ...pageData],
          hasNextPage: hasMore,
          loadingMore: false,
          currentPage: nextPage,
        }));
      } else {
        set({ hasNextPage: false, loadingMore: false });
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
    set({ refreshing: true, error: null });
    try {
      const data = await getLaunches(1, 1000);
      const allLaunches = ensureUniqueLaunches(data.docs);
      const { pageData, hasNextPage: hasMore } = paginateLaunches(allLaunches, 1, 10);

      set({
        launches: pageData,
        originalLaunches: allLaunches,
        hasNextPage: hasMore,
        refreshing: false,
        retryCount: 0,
        currentPage: 1,
      });
    } catch (error: any) {
      logError('Failed to refresh launches', error as Error);
      set({ refreshing: false, error: 'Failed to refresh launches' });
    }
  },

  fetchLaunchpadById: async (id: string) => {
    try {
      const pad = await getLaunchpadById(id);
      if (pad && typeof pad.latitude === 'number' && typeof pad.longitude === 'number') {
        set({ selectedLaunchpad: pad, error: null });
      } else {
        const errorMessage = 'Launchpad data is incomplete or missing coordinates.';
        logError(errorMessage, undefined, { launchpadId: id, launchpad: pad });
        set({ error: errorMessage, selectedLaunchpad: null });
      }
    } catch (error: any) {
      let errorMessage = 'Failed to load launchpad.';
      
      if (error.message) {
        if (error.message.includes('Launchpad not found')) {
          errorMessage = `Launchpad not found: ${id}`;
        } else if (error.message.includes('Failed to fetch launchpad')) {
          errorMessage = error.message;
        } else if (error.message.includes('Network Error')) {
          errorMessage = 'Network connection error. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      } else if (error.response?.status) {
        const status = error.response.status;
        if (status === 404) {
          errorMessage = `Launchpad not found: ${id}`;
        } else if (status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = `Request failed with status ${status}`;
        }
      }
      
      logError(`Failed to fetch launchpad with ID: ${id}`, error as Error, { 
        errorMessage, 
        statusCode: error.response?.status,
        responseData: error.response?.data 
      });
      
      set({ error: errorMessage, selectedLaunchpad: null });
    }
  },

  setSelectedLaunchpadId: (id) => set({ selectedLaunchpadId: id }),
  clearSelectedLaunchpadId: () => set({ selectedLaunchpadId: null, selectedLaunchpad: null }),
  clearError: () => set({ error: null, retryCount: 0 }),
}));

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

const paginateLaunches = (launches: Launch[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pageData = launches.slice(startIndex, endIndex);
  const hasNextPage = endIndex < launches.length;

  return { pageData, hasNextPage };
};
