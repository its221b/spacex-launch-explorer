import axios from 'axios';
import { logError } from '../utils/logger';
import { getNetworkErrorMessage } from '../utils/networkUtils';

const client = axios.create({
  baseURL: 'https://api.spacexdata.com',
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add request interceptor for logging
client.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    logError('Request interceptor error', error);
    return Promise.reject(error);
  },
);

// Add response interceptor for better error handling
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Use the network utility for better error messages
    error.message = getNetworkErrorMessage(error);
    logError('API request failed', error);
    return Promise.reject(error);
  },
);

export default client;
