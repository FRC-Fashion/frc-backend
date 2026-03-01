import * as winston from 'winston';
import clc from 'cli-color';
import 'winston-daily-rotate-file';

export const winstonConfig = {
  transports: [
    // 1. Console Transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.ms(),
        winston.format.printf((info) => {
          const { timestamp, level, message, context, ms } = info;

          // Branding: [FRC-API] - ensure clc.cyan exists
          const brand = clc.cyan('[FRC-API]');

          // Level colors
          let colorizedLevel = level.toUpperCase();
          if (level === 'info') colorizedLevel = clc.blue(colorizedLevel);
          else if (level === 'error') colorizedLevel = clc.red(colorizedLevel);
          else if (level === 'warn')
            colorizedLevel = clc.yellow(colorizedLevel);
          else if (level === 'debug')
            colorizedLevel = clc.magenta(colorizedLevel);

          // Context
          const contextPart = context ? clc.yellow(`[${context}]`) : '';

          // Timestamp and MS
          const time = clc.blackBright(timestamp || '');
          const msPart = ms ? clc.yellow(ms) : '';

          return `${brand}  ${time}  ${colorizedLevel} ${contextPart} ${message} ${msPart}`;
        }),
      ),
    }),
    // 2. Error File Transport (Rotates daily)
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // 3. Combined File Transport (All logs)
    new winston.transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
