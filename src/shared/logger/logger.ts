import { createLogger, format, Logger } from 'winston';
import { consoleTransport } from './transports/console.transport';
import { fileTransport } from './transports/file.transport';
import { SlackTransport } from './transports/slack.transport';

const { combine, timestamp, errors, json } = format;

const buildTransports = () => {
  const activeTransports: any[] = [consoleTransport];

  if (process.env.LOG_TO_FILE === 'true') {
    activeTransports.push(fileTransport);
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const slackLevel = process.env.SLACK_LOG_LEVEL ?? 'error';

  if (webhookUrl) {
    activeTransports.push(
      new SlackTransport({
        webhookUrl,
        level: slackLevel,
      })
    );
  }

  return activeTransports;
};

const logger: Logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json()
  ),
  transports: buildTransports(),
  silent: process.env.NODE_ENV === 'test',
});

export default logger;