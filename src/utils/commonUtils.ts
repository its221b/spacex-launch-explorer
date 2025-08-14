import { Launch } from '../api/types';
import { LAUNCH_STATUS, LaunchStatusType } from './constants';

/**
 * Determines the launch status based on launch data
 * @param launch - The launch object
 * @returns The launch status string
 */
export const getLaunchStatus = (launch: Launch): LaunchStatusType => {
  if (!launch.date_utc) {
    return LAUNCH_STATUS.UNKNOWN;
  }

  const launchDate = new Date(launch.date_utc);
  const now = new Date();

  if (launchDate > now) {
    return LAUNCH_STATUS.UPCOMING;
  }

  if (launch.success === true) {
    return LAUNCH_STATUS.SUCCESS;
  }

  if (launch.success === false) {
    return LAUNCH_STATUS.FAILED;
  }

  return LAUNCH_STATUS.UNKNOWN;
};

/**
 * Formats a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Unknown date';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
};
