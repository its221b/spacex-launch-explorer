import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../utils/constants';

type Props = {
  icon?: string;
  title?: string;
  subtitle?: string;
};

export default function EmptyState({
  icon = 'rocket-outline',
  title = 'No launches found',
  subtitle = 'Try adjusting your search or check back later for new launches.',
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={64} color={COLORS.textMuted} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING['4xl'],
  },
  icon: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.size.sm * TYPOGRAPHY.lineHeight.normal,
    textAlign: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.xs,
  },
});
