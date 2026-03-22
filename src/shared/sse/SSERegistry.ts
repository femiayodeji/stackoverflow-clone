import { Response } from 'express';
import logger from '../logger';

export class SSERegistry {
  private clients: Map<number, Response>;

  constructor() {
    this.clients = new Map();
  }

  register(userId: number, res: Response): void {
    this.clients.set(userId, res);
    logger.info('SSE client connected', { userId, totalClients: this.clients.size });
  }

  remove(userId: number): void {
    this.clients.delete(userId);
    logger.info('SSE client disconnected', { userId, totalClients: this.clients.size });
  }

  isConnected(userId: number): boolean {
    return this.clients.has(userId);
  }

  send(userId: number, event: string, data: unknown): void {
    const res = this.clients.get(userId);
    if (!res) return;

    try {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err: any) {
      logger.error('Failed to send SSE event', {
        userId,
        event,
        error: err.message,
      });
      this.remove(userId);
    }
  }

  get size(): number {
    return this.clients.size;
  }
}

// Singleton instance
export const sseRegistry = new SSERegistry();