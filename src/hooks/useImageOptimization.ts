import { useState, useEffect, useCallback } from 'react';
import { Image } from 'react-native';

interface UseImageOptimizationProps {
  imageUrl: string | null;
  fallbackUrl?: string | null;
}

interface UseImageOptimizationReturn {
  optimizedUrl: string | null;
  isLoading: boolean;
  hasError: boolean;
  isLoaded: boolean;
  retry: () => void;
}

export const useImageOptimization = ({
  imageUrl,
  fallbackUrl,
}: UseImageOptimizationProps): UseImageOptimizationReturn => {
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimize image URL for better performance
  const getOptimizedUrl = useCallback((url: string): string => {
    // If it's already a small image, return as is
    if (url.includes('small')) return url;

    // For SpaceX API images, prefer smaller versions for list items
    if (url.includes('large')) {
      return url.replace('/large/', '/small/');
    }

    // For other images, try to get a smaller version if possible
    // This is a generic approach that might work for some CDNs
    if (url.includes('?') || url.includes('&')) {
      // URL already has parameters, add size parameter
      return `${url}&w=120&h=120&fit=crop`;
    } else {
      // Add size parameters
      return `${url}?w=120&h=120&fit=crop`;
    }
  }, []);

  // Preload image using React Native's Image.prefetch
  const preloadImage = useCallback(async (url: string): Promise<boolean> => {
    try {
      await Image.prefetch(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Update optimized URL when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      const optimized = getOptimizedUrl(imageUrl);
      setOptimizedUrl(optimized);
      setIsLoading(true);
      setHasError(false);
      setIsLoaded(false);

      // Preload the optimized image
      preloadImage(optimized).then((success) => {
        setIsLoading(false);
        if (success) {
          setIsLoaded(true);
        } else {
          // If optimization fails, try original URL
          setOptimizedUrl(imageUrl);
          setIsLoaded(true);
        }
      });
    } else if (fallbackUrl) {
      setOptimizedUrl(fallbackUrl);
      setIsLoaded(true);
    } else {
      setOptimizedUrl(null);
      setIsLoaded(false);
    }
  }, [imageUrl, fallbackUrl, getOptimizedUrl, preloadImage]);

  const retry = useCallback(() => {
    if (imageUrl) {
      setHasError(false);
      setIsLoading(true);
      setIsLoaded(false);

      preloadImage(imageUrl).then((success) => {
        setIsLoading(false);
        if (success) {
          setIsLoaded(true);
        } else {
          setHasError(true);
        }
      });
    }
  }, [imageUrl, preloadImage]);

  return {
    optimizedUrl,
    isLoading,
    hasError,
    isLoaded,
    retry,
  };
};
