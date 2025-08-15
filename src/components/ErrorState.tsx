import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../utils/constants';

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
};

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading the data. Please try again.',
  onRetry,
  showRetry = true,
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="warning-outline" size={64} color={COLORS.warning} style={styles.icon} />

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {showRetry && onRetry && (
        <TouchableOpacity style={[styles.retryButton, styles.buttonPrimary]} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}

      <View style={styles.troubleshooting}>
        <Text style={styles.troubleshootingTitle}>Troubleshooting tips:</Text>
        <Text style={styles.troubleshootingText}>• Check your internet connection</Text>
        <Text style={styles.troubleshootingText}>• Make sure you have a stable network</Text>
        <Text style={styles.troubleshootingText}>• Try refreshing the app</Text>
        <Text style={styles.troubleshootingText}>• Contact support if the problem persists</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING['2xl'],
    backgroundColor: COLORS.background,
  },
  icon: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING['2xl'],
    textAlign: 'center',
  },
  retryButton: {
    marginBottom: SPACING['2xl'],
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: BORDER_RADIUS.md,
  },
  troubleshooting: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
  },
  troubleshootingTitle: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  troubleshootingText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
});
