import { transports, format } from 'winston';
import path from 'path';

const { combine, timestamp, json } = format;

const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  json()
);

const logFilePath = process.env.LOG_FILE_PATH ?? 'logs/app.log';

export const fileTransport = new transports.File({
  filename: path.resolve(logFilePath),
  format: fileFormat,
});