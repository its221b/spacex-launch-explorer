import { Image } from 'react-native';
import { logError } from './logger';

interface PreloadItem {
  url: string;
  priority: number;
  timestamp: number;
}

class ImagePreloader {
  private preloadQueue: PreloadItem[] = [];
  private isProcessing = false;
  private maxConcurrent = 3;
  private activePreloads = 0;

  queueForPreload(url: string, priority: number = 1): void {
    if (!url || this.preloadQueue.some(item => item.url === url)) {
      return;
    }

    this.preloadQueue.push({
      url,
      priority,
      timestamp: Date.now(),
    });

    this.preloadQueue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.timestamp - b.timestamp;
    });

    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.activePreloads >= this.maxConcurrent) {
      return;
    }

    this.isProcessing = true;

    while (this.preloadQueue.length > 0 && this.activePreloads < this.maxConcurrent) {
      const item = this.preloadQueue.shift();
      if (item) {
        this.activePreloads++;
        this.preloadImage(item.url).finally(() => {
          this.activePreloads--;
          this.processQueue();
        });
      }
    }

    this.isProcessing = false;
  }

  private async preloadImage(url: string): Promise<void> {
    try {
      await Image.prefetch(url);
    } catch (error) {
      logError(`Failed to preload image: ${url}`, error as Error);
    }
  }

  clearQueue(): void {
    this.preloadQueue = [];
  }

  getQueueLength(): number {
    return this.preloadQueue.length;
  }

  getActivePreloads(): number {
    return this.activePreloads;
  }
}

export const imagePreloader = new ImagePreloader();
