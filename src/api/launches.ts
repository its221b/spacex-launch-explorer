import client from './client';
import { Launch, Launchpad } from './types';
import { logError, logInfo } from '../utils/logger';
import axios from 'axios';

const launchpadClient = axios.create({
  baseURL: 'https://api.spacexdata.com/v4',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

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
    logInfo(`Fetching launches page ${page} with limit ${limit}`);

    const offset = (page - 1) * limit;

    const res = await client.get(
      `/launches?limit=${limit}&offset=${offset}&sort=date_utc&order=desc`,
    );
    const data = res.data;

    const hasNextPage = Array.isArray(data) && data.length === limit;

    const result: PaginatedLaunchesResponse = {
      docs: Array.isArray(data) ? data : [],
      hasNextPage,
      totalDocs: 0,
      totalPages: 0,
      page,
      limit,
    };

    logInfo(`Successfully fetched ${result.docs.length} launches (page ${page})`);
    return result;
  } catch (error) {
    logError('Failed to fetch launches from SpaceX API', error as Error);
    throw error;
  }
};

export const getLaunchById = async (id: string): Promise<Launch> => {
  try {
    logInfo(`Fetching launch details for ID: ${id}`);
    const res = await client.get(`/launches/${id}`);
    const launch = res.data as Launch;
    logInfo(`Successfully fetched launch: ${launch.name}`);
    return launch;
  } catch (error) {
    logError(`Failed to fetch launch with ID: ${id}`, error as Error);
    throw error;
  }
};

export const getLaunchpadById = async (id: string): Promise<Launchpad> => {
  try {
    logInfo(`Fetching launchpad details for ID: ${id}`);
    const res = await launchpadClient.get(`/launchpads/${id}`);
    const launchpad = res.data as Launchpad;
    logInfo(`Successfully fetched launchpad: ${launchpad.name}`);
    return launchpad;
  } catch (error) {
    logError(`Failed to fetch launchpad with ID: ${id}`, error as Error);
    throw error;
  }
};
