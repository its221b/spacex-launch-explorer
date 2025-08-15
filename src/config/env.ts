import { GOOGLE_MAPS_API_KEY_ANDROID, API_BASE_URL } from '@env';

interface EnvironmentConfig {
  GOOGLE_MAPS_API_KEY_ANDROID: string;
  API_BASE_URL: string;
}

const config: EnvironmentConfig = {
  GOOGLE_MAPS_API_KEY_ANDROID: GOOGLE_MAPS_API_KEY_ANDROID || '',
  API_BASE_URL: API_BASE_URL || 'https://api.spacexdata.com/v4',
};

export const validateEnvironment = (): void => {
  const requiredVars = ['GOOGLE_MAPS_API_KEY_ANDROID'];

  const missingVars = requiredVars.filter(
    (varName) =>
      !config[varName as keyof EnvironmentConfig] ||
      config[varName as keyof EnvironmentConfig] === `YOUR_${varName}_HERE`,
  );

  if (missingVars.length > 0) {
    // Environment variable not found, using default
  }
};

export default config;
