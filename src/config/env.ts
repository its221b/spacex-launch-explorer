import { GOOGLE_MAPS_API_KEY_ANDROID } from '@env';

interface EnvironmentConfig {
  GOOGLE_MAPS_API_KEY_ANDROID: string;
}

const config: EnvironmentConfig = {
  GOOGLE_MAPS_API_KEY_ANDROID: GOOGLE_MAPS_API_KEY_ANDROID || '',
};

export const validateEnvironment = (): void => {
  const requiredVars = ['GOOGLE_MAPS_API_KEY_ANDROID'];

  const missingVars = requiredVars.filter(
    (varName) =>
      !config[varName as keyof EnvironmentConfig] ||
      config[varName as keyof EnvironmentConfig] === `YOUR_${varName}_HERE`,
  );

  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
  }
};

export default config;
