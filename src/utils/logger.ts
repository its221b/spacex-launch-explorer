type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 50;
  private isProcessing = false;

  private log(level: LogLevel, message: string, data?: any, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    if (__DEV__) {
      const prefix = `[${level.toUpperCase()}]`;
      switch (level) {
        case 'error':
          console.error(prefix, message, data, error);
          break;
        case 'warn':
          console.warn(prefix, message, data);
          break;
        case 'info':
          console.info(prefix, message, data);
          break;
        default:
          console.log(prefix, message, data);
      }
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error, data?: any) {
    this.log('error', message, data, error);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();

export const logDebug = (message: string, data?: any) => logger.debug(message, data);
export const logInfo = (message: string, data?: any) => logger.info(message, data);
export const logWarn = (message: string, data?: any) => logger.warn(message, data);
export const logError = (message: string, error?: Error, data?: any) =>
  logger.error(message, error, data);
