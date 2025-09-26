import winston from 'winston'

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
})

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

export const logger = winston.createLogger({
  level: "info",
  format: format,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
    new winston.transports.File({ filename: "info.log" }),
  ],
});

