import client from './client';
import { Launch, Launchpad } from './types';
import { logError, logInfo } from '../utils/logger';

export interface PaginatedLaunchesResponse {
  docs: Launch[];
  hasNextPage: boolean;
}

export const getLaunches = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaginatedLaunchesResponse> => {
  try {
    logInfo(`Fetching launches page ${page} with limit ${limit}`);
    
    const params: any = {
      page,
      limit,
      sort: { date_utc: 'desc' } // Most recent first
    };
    
    if (search && search.trim()) {
      params.query = {
        $or: [
          { name: { $regex: search.trim(), $options: 'i' } },
          { details: { $regex: search.trim(), $options: 'i' } }
        ]
      };
    }
    
    const res = await client.post('/v5/launches/query', {
      query: params.query || {},
      options: {
        page,
        limit,
        sort: params.sort,
        populate: ['launchpad']
      }
    });
    
    const data = res.data;
    const result: PaginatedLaunchesResponse = {
      docs: data.docs || [],
      hasNextPage: data.hasNextPage || false
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
    const res = await client.get(`/v5/launches/${id}`);
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
    const res = await client.get(`/v4/launchpads/${id}`);
    const launchpad = res.data as Launchpad;
    logInfo(`Successfully fetched launchpad: ${launchpad.name}`);
    return launchpad;
  } catch (error) {
    logError(`Failed to fetch launchpad with ID: ${id}`, error as Error);
    throw error;
  }
};
