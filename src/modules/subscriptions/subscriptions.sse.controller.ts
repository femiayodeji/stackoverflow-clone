import { Request, Response } from 'express';
import { sseRegistry } from '@/shared/sse/SSERegistry';
import logger from '@/shared/logger';

export class SubscriptionsSSEController {
  /**
   * GET /api/notifications/stream
   *
   * Opens a persistent SSE connection for the authenticated user.
   * The client receives real-time notification events as they are emitted.
   *
   * Client usage (browser):
   *   const source = new EventSource('/api/notifications/stream', {
   *     headers: { Authorization: `Bearer ${token}` }
   *   });
   *   source.addEventListener('notification', (e) => console.log(e.data));
   */
  stream = (req: Request, res: Response): void => {
    const userId = req.user!.userId;

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Send an initial connected event so client knows stream is live
    res.write(`event: connected\n`);
    res.write(`data: ${JSON.stringify({ message: 'SSE connection established' })}\n\n`);

    sseRegistry.register(userId, res);

    // Send a heartbeat every 30 seconds to keep the connection alive
    const heartbeat = setInterval(() => {
      try {
        res.write(': heartbeat\n\n');
      } catch {
        clearInterval(heartbeat);
      }
    }, 30000);

    // Clean up when client disconnects
    req.on('close', () => {
      clearInterval(heartbeat);
      sseRegistry.remove(userId);
      logger.info('SSE connection closed by client', { userId });
    });
  };
}

export const subscriptionsSSEController = new SubscriptionsSSEController();