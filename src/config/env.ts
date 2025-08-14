// Environment configuration
// This file loads environment variables and provides secure access to API keys
import { GOOGLE_MAPS_API_KEY_ANDROID, API_BASE_URL } from '@env';

interface EnvironmentConfig {
  GOOGLE_MAPS_API_KEY_ANDROID: string;
  API_BASE_URL: string;
}

// Load environment variables
const config: EnvironmentConfig = {
  GOOGLE_MAPS_API_KEY_ANDROID: GOOGLE_MAPS_API_KEY_ANDROID || '',
  API_BASE_URL: API_BASE_URL || 'https://api.spacexdata.com/v4',
};

// Validate required environment variables
export const validateEnvironment = (): void => {
  const requiredVars = ['GOOGLE_MAPS_API_KEY_ANDROID'];

  const missingVars = requiredVars.filter(
    (varName) =>
      !config[varName as keyof EnvironmentConfig] ||
      config[varName as keyof EnvironmentConfig] === `YOUR_${varName}_HERE`,
  );

  if (missingVars.length > 0) {
    console.warn(
      `⚠️  Missing or invalid environment variables: ${missingVars.join(', ')}\n` +
        `Please check your .env file and ensure all required API keys are set.`,
    );
  }
};

// Export configuration
export default config;
