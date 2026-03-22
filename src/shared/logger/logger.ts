import { createLogger, format, Logger, transports as winstonTransports } from 'winston';
import { consoleTransport } from './transports/console.transport';
import { fileTransport } from './transports/file.transport';
import { SlackTransport } from './transports/slack.transport';

const { combine, timestamp, errors, json } = format;

const isTestEnv = process.env.NODE_ENV === 'test';

const buildTransports = () => {
  // Use a no-op transport in test mode to avoid open handles
  if (isTestEnv) {
    return [new winstonTransports.Console({ silent: true })];
  }

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