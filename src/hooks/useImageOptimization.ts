import { useState, useEffect, useCallback, useMemo } from 'react';
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

  const getOptimizedUrl = useCallback((url: string): string => {
    if (url.includes('small')) return url;

    if (url.includes('large')) {
      return url.replace('/large/', '/small/');
    }

    if (url.includes('?') || url.includes('&')) {
      return `${url}&w=120&h=120&fit=crop`;
    } else {
      return `${url}?w=120&h=120&fit=crop`;
    }
  }, []);

  const preloadImage = useCallback(async (url: string): Promise<boolean> => {
    try {
      await Image.prefetch(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  const memoizedOptimizedUrl = useMemo(() => {
    if (!imageUrl) return null;
    return getOptimizedUrl(imageUrl);
  }, [imageUrl, getOptimizedUrl]);

  useEffect(() => {
    if (imageUrl) {
      const optimized = memoizedOptimizedUrl;
      if (optimized !== optimizedUrl) {
        setOptimizedUrl(optimized);
        setIsLoading(true);
        setHasError(false);
        setIsLoaded(false);

        preloadImage(optimized).then((success) => {
          setIsLoading(false);
          if (success) {
            setIsLoaded(true);
          } else {
            setOptimizedUrl(imageUrl);
            setIsLoaded(true);
          }
        });
      }
    } else if (fallbackUrl) {
      setOptimizedUrl(fallbackUrl);
      setIsLoaded(true);
    } else {
      setOptimizedUrl(null);
      setIsLoaded(false);
    }
  }, [imageUrl, fallbackUrl, memoizedOptimizedUrl, optimizedUrl, preloadImage]);

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
