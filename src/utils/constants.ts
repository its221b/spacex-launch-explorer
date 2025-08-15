export const COLORS = {
  primary: '#007AFF',
  primaryLight: '#e7f0ff',

  secondary: '#34C759',

  success: '#34C759',
  successLight: '#e7f7e7',
  warning: '#ff6b6b',
  error: '#ff6b6b',
  errorLight: '#ffe7e7',

  white: '#fff',
  gray: {
    100: '#f1f3f5',
    200: '#e9ecef',
    600: '#666',
  },

  background: '#fff',
  surface: '#f8f9fa',
  card: '#fff',

  textPrimary: '#333',
  textSecondary: '#666',
  textTertiary: '#999',
  textMuted: '#ccc',

  border: '#e8e8e8',
  borderLight: '#f0f0f0',

  shadow: '#000',

  map: {
    launchpad: '#FF4444',
    userLocation: '#4444FF',
  },
} as const;

export const TYPOGRAPHY = {
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
  },

  weight: {
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    normal: 1.5,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
} as const;

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const LAUNCH_STATUS = {
  UPCOMING: 'upcoming',
  SUCCESS: 'success',
  FAILED: 'failed',
  UNKNOWN: 'unknown',
} as const;

export type LaunchStatusType = (typeof LAUNCH_STATUS)[keyof typeof LAUNCH_STATUS];

export const getLaunchStatusStyle = (status: LaunchStatusType) => {
  switch (status) {
    case LAUNCH_STATUS.UPCOMING:
      return {
        backgroundColor: COLORS.primaryLight,
        color: COLORS.primary,
      };
    case LAUNCH_STATUS.SUCCESS:
      return {
        backgroundColor: COLORS.successLight,
        color: COLORS.success,
      };
    case LAUNCH_STATUS.FAILED:
      return {
        backgroundColor: COLORS.errorLight,
        color: COLORS.error,
      };
    default:
      return {
        backgroundColor: COLORS.gray[100],
        color: COLORS.gray[600],
      };
  }
};
