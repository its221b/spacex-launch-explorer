import client from './client';
import { Launch, Launchpad } from './types';
import { logError } from '../utils/logger';
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
    const offset = (page - 1) * limit;

    const res = await client.get(
      `/launches?limit=${limit}&offset=${offset}&sort=date_utc&order=desc`,
    );
    const data = res.data;

    // Check if we're getting more data than requested (API ignoring limit)
    const hasNextPage = data.length > limit;

    // If API is ignoring limit, we need to manually paginate
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
  try {
    const res = await launchpadClient.get(`/launchpads/${id}`);
    const launchpad = res.data as Launchpad;
    return launchpad;
  } catch (error) {
    logError(`Failed to fetch launchpad with ID: ${id}`, error as Error);
    throw error;
  }
};
