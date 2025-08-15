export const COLORS = {
  primary: '#007AFF',
  primaryLight: '#e7f0ff',

  secondary: '#34C759',
  secondaryLight: '#e7f7e7',

  success: '#34C759',
  successLight: '#e7f7e7',
  warning: '#ff6b6b',
  warningLight: '#ffe7e7',
  error: '#ff6b6b',
  errorLight: '#ffe7e7',

  white: '#fff',
  black: '#000',
  gray: {
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#e8e8e8',
    400: '#ccc',
    500: '#999',
    600: '#666',
    700: '#555',
    800: '#333',
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
    '2xl': 24,
    '3xl': 32,
    '4xl': 48,
  },

  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const SPACING = {
  base: 4,

  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,

  card: {
    padding: 16,
    margin: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
} as const;

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
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
  xl: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
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

export const COMMON_STYLES = {
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.card.padding,
    ...SHADOWS.md,
  },

  button: {
    primary: {
      backgroundColor: COLORS.primary,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.button.paddingHorizontal,
      paddingVertical: SPACING.button.paddingVertical,
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.button.paddingHorizontal,
      paddingVertical: SPACING.button.paddingVertical,
    },
  },

  text: {
    heading: {
      fontSize: TYPOGRAPHY.size.xl,
      fontWeight: TYPOGRAPHY.weight.semibold,
      color: COLORS.textPrimary,
    },
    subheading: {
      fontSize: TYPOGRAPHY.size.lg,
      fontWeight: TYPOGRAPHY.weight.semibold,
      color: COLORS.textPrimary,
    },
    body: {
      fontSize: TYPOGRAPHY.size.base,
      fontWeight: TYPOGRAPHY.weight.normal,
      color: COLORS.textSecondary,
    },
    caption: {
      fontSize: TYPOGRAPHY.size.sm,
      fontWeight: TYPOGRAPHY.weight.normal,
      color: COLORS.textTertiary,
    },
  },
} as const;
