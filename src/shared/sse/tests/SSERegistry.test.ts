import { SSERegistry } from '../SSERegistry';
import { Response } from 'express';

const createMockRes = (): Partial<Response> => ({
  write: jest.fn(),
});

describe('SSERegistry', () => {
  let registry: SSERegistry;

  beforeEach(() => {
    registry = new SSERegistry();
  });

  it('should register a client', () => {
    const res = createMockRes() as Response;
    registry.register(1, res);

    expect(registry.isConnected(1)).toBe(true);
    expect(registry.size).toBe(1);
  });

  it('should remove a client', () => {
    const res = createMockRes() as Response;
    registry.register(1, res);
    registry.remove(1);

    expect(registry.isConnected(1)).toBe(false);
    expect(registry.size).toBe(0);
  });

  it('should send an SSE event to a connected client', () => {
    const res = createMockRes() as Response;
    registry.register(1, res);

    registry.send(1, 'notification', { message: 'New answer' });

    expect(res.write).toHaveBeenCalledTimes(2);
    expect(res.write).toHaveBeenNthCalledWith(1, 'event: notification\n');
    expect(res.write).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('"message":"New answer"')
    );
  });

  it('should silently skip send if user is not connected', () => {
    expect(() => registry.send(999, 'notification', {})).not.toThrow();
  });

  it('should remove client if write throws', () => {
    const res = {
      write: jest.fn().mockImplementation(() => {
        throw new Error('Stream closed');
      }),
    } as unknown as Response;

    registry.register(1, res);
    registry.send(1, 'notification', { message: 'test' });

    expect(registry.isConnected(1)).toBe(false);
  });

  it('should handle multiple clients independently', () => {
    const res1 = createMockRes() as Response;
    const res2 = createMockRes() as Response;

    registry.register(1, res1);
    registry.register(2, res2);

    registry.send(1, 'notification', { message: 'For user 1' });

    expect(res1.write).toHaveBeenCalled();
    expect(res2.write).not.toHaveBeenCalled();
  });
});