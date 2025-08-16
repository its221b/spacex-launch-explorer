import { Launch } from '../api/types';
import { LAUNCH_STATUS, LaunchStatusType } from './constants';

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

export const isValidLaunchpadId = (id: string): boolean => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

export const sanitizeLaunchpadId = (id: string): string | null => {
  if (!id) return null;
  
  const sanitized = id.trim();
  if (!isValidLaunchpadId(sanitized)) {
    return null;
  }
  
  return sanitized;
};
