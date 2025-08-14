/**
 * Image Preloader Utility
 * Preloads images in the background to improve perceived performance
 */

class ImagePreloader {
  private preloadedImages: Set<string> = new Set();
  private preloadQueue: string[] = [];
  private isProcessing = false;

  /**
   * Preload a single image using React Native's Image.prefetch
   */
  preloadImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.preloadedImages.has(url)) {
        resolve(true);
        return;
      }

      // Use React Native's built-in prefetch method
      import('react-native').then(({ Image }) => {
        Image.prefetch(url)
          .then(() => {
            this.preloadedImages.add(url);
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      }).catch(() => {
        resolve(false);
      });
    });
  }

  /**
   * Preload multiple images in sequence
   */
  async preloadImages(urls: string[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const url of urls) {
      try {
        const result = await this.preloadImage(url);
        if (result) {
          success++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Queue images for background preloading
   */
  queueForPreload(urls: string[]): void {
    this.preloadQueue.push(...urls);
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process the preload queue in the background
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.preloadQueue.length > 0) {
      const batch = this.preloadQueue.splice(0, 5); // Process 5 at a time
      
      try {
        await this.preloadImages(batch);
      } catch (error) {
        console.warn('Image preloading error:', error);
      }

      // Small delay to prevent blocking the main thread
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
  }

  /**
   * Check if an image is preloaded
   */
  isPreloaded(url: string): boolean {
    return this.preloadedImages.has(url);
  }

  /**
   * Clear preloaded images (useful for memory management)
   */
  clearCache(): void {
    this.preloadedImages.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { preloaded: number; queued: number } {
    return {
      preloaded: this.preloadedImages.size,
      queued: this.preloadQueue.length,
    };
  }
}

// Export singleton instance
export const imagePreloader = new ImagePreloader();

// Export the class for testing or custom instances
export { ImagePreloader };
