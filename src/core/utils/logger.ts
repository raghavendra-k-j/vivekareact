export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
}

export class Logger {
    private currentLevel: LogLevel;
    private tag?: string;
    private stackTraceDepth: number;

    constructor(tag?: string, level: LogLevel = LogLevel.DEBUG, stackTraceDepth: number = 0) {
        this.tag = tag;
        this.currentLevel = level;
        this.stackTraceDepth = stackTraceDepth;
    }

    public setLogLevel(level: LogLevel): void {
        this.currentLevel = level;
    }

    public setStackTraceDepth(depth: number): void {
        this.stackTraceDepth = depth;
    }

    private format(levelLabel: string, args: unknown[]): unknown[] {
        const prefix = `[${levelLabel}]${this.tag ? ` [${this.tag}]` : ''}`;
        const formattedArgs = [prefix, ...args];

        if (this.stackTraceDepth > 0) {
            const stack = new Error().stack;
            if (stack) {
                const stackLines = stack
                    .split('\n')
                    .slice(3, 3 + this.stackTraceDepth); // Skip lines: Error, this.format(), and log method
                formattedArgs.push('\nStack trace:');
                for (const line of stackLines) {
                    formattedArgs.push(line.trim());
                }
            }
        }

        return formattedArgs;
    }

    public info(...args: unknown[]): void {
        if (this.currentLevel >= LogLevel.INFO) {
            console.log(...this.format('INFO', args));
        }
    }

    public warn(...args: unknown[]): void {
        if (this.currentLevel >= LogLevel.WARN) {
            console.warn(...this.format('WARN', args));
        }
    }

    public error(...args: unknown[]): void {
        if (this.currentLevel >= LogLevel.ERROR) {
            console.error(...this.format('ERROR', args));
        }
    }

    public debug(...args: unknown[]): void {
        if (this.currentLevel >= LogLevel.DEBUG) {
            console.log(...this.format('DEBUG', args));
        }
    }
}

export const logger = new Logger('default', LogLevel.DEBUG, 3);
