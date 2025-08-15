import { Image } from 'react-native';

class ImagePreloader {
  private preloadedImages: Set<string> = new Set();
  private preloadQueue: string[] = [];
  private isProcessing = false;

  preloadImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.preloadedImages.has(url)) {
        resolve(true);
        return;
      }

      Image.prefetch(url)
        .then(() => {
          this.preloadedImages.add(url);
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

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
        // Handle preloading error silently
      }
    }

    return { success, failed };
  }

  queueForPreload(urls: string[]): void {
    this.preloadQueue.push(...urls);

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.preloadQueue.length > 0) {
      const batch = this.preloadQueue.splice(0, 5);

      try {
        await this.preloadImages(batch);
      } catch {
        // Handle preloading error silently
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
  }

  isPreloaded(url: string): boolean {
    return this.preloadedImages.has(url);
  }

  clearCache(): void {
    this.preloadedImages.clear();
  }

  getCacheStats(): { preloaded: number; queued: number } {
    return {
      preloaded: this.preloadedImages.size,
      queued: this.preloadQueue.length,
    };
  }
}

export const imagePreloader = new ImagePreloader();

export { ImagePreloader };
