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

  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }

  if (error.response?.status >= 400) {
    return 'Request failed. Please check your input and try again.';
  }

  return 'An unexpected error occurred. Please try again.';
};
