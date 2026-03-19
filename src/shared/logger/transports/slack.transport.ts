import TransportStream from 'winston-transport';
import https from 'https';
import { URL } from 'url';

interface SlackTransportOptions extends TransportStream.TransportStreamOptions {
  webhookUrl: string;
  minLevel?: string;
}

const LEVEL_ICONS: Record<string, string> = {
  error: '🔴',
  warn: '🟡',
  info: '🔵',
  debug: '⚪',
};

export class SlackTransport extends TransportStream {
  private webhookUrl: string;

  constructor(options: SlackTransportOptions) {
    super(options);
    this.webhookUrl = options.webhookUrl;
  }

  log(info: any, callback: () => void): void {
    setImmediate(() => this.emit('logged', info));

    const icon = LEVEL_ICONS[info.level] ?? '⚪';
    const text = [
      `${icon} *[${info.level.toUpperCase()}]* \`${new Date().toISOString()}\``,
      `*Message:* ${info.message}`,
      info.stack ? `*Stack:*\n\`\`\`${info.stack}\`\`\`` : null,
      info.service ? `*Service:* ${info.service}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const payload = JSON.stringify({ text });

    try {
      const url = new URL(this.webhookUrl);
      const reqOptions = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(reqOptions);
      req.on('error', (err) => {
        // fail silently — a broken Slack webhook must never crash the app
        console.error('[SlackTransport] Failed to send:', err.message);
      });
      req.write(payload);
      req.end();
    } catch (err) {
      console.error('[SlackTransport] Invalid webhook URL:', err);
    }

    callback();
  }
}