import client, { v4Client } from './client';
import { Launch, Launchpad } from './types';
import { logError } from '../utils/logger';
import { sanitizeLaunchpadId } from '../utils/commonUtils';

export interface PaginatedLaunchesResponse {
  docs: Launch[];
  hasNextPage: boolean;
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const getLaunches = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedLaunchesResponse> => {
  try {
    const offset = (page - 1) * limit;

    const res = await client.get(
      `/launches?limit=${limit}&offset=${offset}&sort=date_utc&order=desc`,
    );
    const data = res.data;

    const hasNextPage = data.length > limit;
    const paginatedData = Array.isArray(data) ? data.slice(0, limit) : [];

    const result: PaginatedLaunchesResponse = {
      docs: paginatedData,
      hasNextPage,
      totalDocs: 0,
      totalPages: 0,
      page,
      limit,
    };

    return result;
  } catch (error) {
    logError('Failed to fetch launches from SpaceX API', error as Error);
    throw error;
  }
};

export const getLaunchById = async (id: string): Promise<Launch> => {
  try {
    const res = await client.get(`/launches/${id}`);
    const launch = res.data as Launch;
    return launch;
  } catch (error) {
    logError(`Failed to fetch launch with ID: ${id}`, error as Error);
    throw error;
  }
};

export const getLaunchpadById = async (id: string): Promise<Launchpad> => {
  const sanitizedId = sanitizeLaunchpadId(id);
  if (!sanitizedId) {
    throw new Error(`Invalid launchpad ID format: ${id}. Expected 24-character hexadecimal string.`);
  }

  try {
    const res = await v4Client.get(`/launchpads/${sanitizedId}`);
    const launchpad = res.data as Launchpad;
    
    return {
      id: launchpad.id,
      name: launchpad.name,
      full_name: launchpad.full_name,
      locality: launchpad.locality,
      region: launchpad.region,
      latitude: launchpad.latitude,
      longitude: launchpad.longitude,
      details: launchpad.details,
      images: launchpad.images,
    };
  } catch (error: any) {
    const statusCode = error.response?.status;
    const statusText = error.response?.statusText;
    const responseData = error.response?.data;
    
    logError(`Failed to fetch launchpad with ID: ${sanitizedId} from v4 API`, error as Error, {
      statusCode,
      statusText,
      responseData,
      endpoint: `/launchpads/${sanitizedId}`,
      baseURL: 'https://api.spacexdata.com/v4'
    });
    
    if (statusCode === 404) {
      throw new Error(`Launchpad not found: ${sanitizedId}`);
    } else {
      throw new Error(`Failed to fetch launchpad: ${statusCode} ${statusText || 'Unknown error'}`);
    }
  }
};
