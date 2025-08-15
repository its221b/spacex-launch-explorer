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
