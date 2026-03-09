/**
 * Logger Utility
 * 
 * Centralized logging with different levels and context
 * 
 * @module lib/logger
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

const logColors = {
    [LogLevel.DEBUG]: '\x1b[36m', // Cyan
    [LogLevel.INFO]: '\x1b[32m',  // Green
    [LogLevel.WARN]: '\x1b[33m',  // Yellow
    [LogLevel.ERROR]: '\x1b[31m', // Red
};

const resetColor = '\x1b[0m';

interface LogContext {
    userId?: string;
    requestId?: string;
    endpoint?: string;
    method?: string;
    [key: string]: any;
}

class Logger {
    private context: LogContext = {};
    private minLevel: LogLevel = LogLevel.INFO;

    constructor(minLevel: LogLevel = LogLevel.INFO) {
        this.minLevel = minLevel;
    }

    setContext(context: Partial<LogContext>) {
        this.context = { ...this.context, ...context };
        return this;
    }

    private formatMessage(level: LogLevel, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const color = logColors[level];
        const levelName = LogLevel[level].padEnd(5);
        
        let contextStr = '';
        if (Object.keys(this.context).length > 0) {
            contextStr = Object.entries(this.context)
                .map(([key, value]) => `${key}=${value}`)
                .join(' ');
        }

        const dataStr = data ? `\n  Data: ${JSON.stringify(data, null, 2)}` : '';
        
        return `${color}[${timestamp}] ${levelName}${resetColor} [${contextStr}] ${message}${dataStr}`;
    }

    debug(message: string, data?: any) {
        if (LogLevel.DEBUG >= this.minLevel) {
            console.log(this.formatMessage(LogLevel.DEBUG, message, data));
        }
    }

    info(message: string, data?: any) {
        if (LogLevel.INFO >= this.minLevel) {
            console.log(this.formatMessage(LogLevel.INFO, message, data));
        }
    }

    warn(message: string, data?: any) {
        if (LogLevel.WARN >= this.minLevel) {
            console.warn(this.formatMessage(LogLevel.WARN, message, data));
        }
    }

    error(message: string, data?: any) {
        if (LogLevel.ERROR >= this.minLevel) {
            console.error(this.formatMessage(LogLevel.ERROR, message, data));
        }
    }

    // Method to create child logger with additional context
    child(context: Partial<LogContext>): Logger {
        const childLogger = new Logger(this.minLevel);
        childLogger.setContext({ ...this.context, ...context });
        return childLogger;
    }
}

// Default logger instance
export const logger = new Logger(
    process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

// Request-scoped logger factory
export const createRequestLogger = (requestId: string, endpoint?: string, method?: string) => {
    return logger.child({ requestId, endpoint, method });
};

// User-scoped logger factory  
export const createUserLogger = (userId: string) => {
    return logger.child({ userId });
};
