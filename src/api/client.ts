import axios from 'axios';
import { logError } from '../utils/logger';
import { getNetworkErrorMessage } from '../utils/networkUtils';

const client = axios.create({
  baseURL: 'https://api.spacexdata.com/v5',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const v4Client = axios.create({
  baseURL: 'https://api.spacexdata.com/v4',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    logError('Request interceptor error', error);
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    error.message = getNetworkErrorMessage(error);
    logError('API request failed', error);
    return Promise.reject(error);
  },
);

export default client;
