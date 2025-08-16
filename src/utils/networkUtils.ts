export const getNetworkErrorMessage = (error: any): string => {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please check your connection and try again.';
  }

  if (error.message === 'Network Error') {
    return 'Network connection error. Please check your internet connection.';
  }

  if (error.response?.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (error.response?.status === 404) {
    return 'Resource not found. Please check the ID and try again.';
  }

  if (error.response?.status === 400) {
    return 'Bad request. Please check your input and try again.';
  }

  if (error.response?.status === 401) {
    return 'Unauthorized. Please check your credentials.';
  }

  if (error.response?.status === 403) {
    return 'Access forbidden. You may not have permission to access this resource.';
  }

  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }

  if (error.response?.status >= 400) {
    return `Request failed with status ${error.response.status}. Please try again.`;
  }

  return 'An unexpected error occurred. Please try again.';
};
