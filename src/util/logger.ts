import { createLogger, transports, format } from 'winston';

const logFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp({
        format: "MM-DD-YY HH:mm:ss",
      }), logFormat),
    transports: [new transports.Console()
    ],
  });

export default logger;
