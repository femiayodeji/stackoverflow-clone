import { Request, Response } from 'express';
import { subscriptionsSSEController } from '../subscriptions.sse.controller';
import { sseRegistry } from '@/shared/sse/SSERegistry';

jest.mock('@/shared/sse/SSERegistry', () => ({
  sseRegistry: {
    register: jest.fn(),
    remove: jest.fn(),
  },
}));

describe('SubscriptionsSSEController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let closeHandler: () => void;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockReq = {
      user: { userId: 1, email: 'alice@example.com' },
      on: jest.fn().mockImplementation((event, handler) => {
        if (event === 'close') closeHandler = handler;
      }),
    };

    mockRes = {
      setHeader: jest.fn(),
      flushHeaders: jest.fn(),
      write: jest.fn(),
    };
  });

  afterEach(() => jest.useRealTimers());

  it('should set SSE headers and register client', () => {
    subscriptionsSSEController.stream(
      mockReq as Request,
      mockRes as Response
    );

    expect(mockRes.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'text/event-stream'
    );
    expect(mockRes.flushHeaders).toHaveBeenCalled();
    expect(sseRegistry.register).toHaveBeenCalledWith(1, mockRes);
  });

  it('should send connected event on stream open', () => {
    subscriptionsSSEController.stream(
      mockReq as Request,
      mockRes as Response
    );

    expect(mockRes.write).toHaveBeenCalledWith('event: connected\n');
  });

  it('should remove client from registry on close', () => {
    subscriptionsSSEController.stream(
      mockReq as Request,
      mockRes as Response
    );

    closeHandler();

    expect(sseRegistry.remove).toHaveBeenCalledWith(1);
  });

  it('should send heartbeat every 30 seconds', () => {
    subscriptionsSSEController.stream(
      mockReq as Request,
      mockRes as Response
    );

    jest.advanceTimersByTime(30000);
    expect(mockRes.write).toHaveBeenCalledWith(': heartbeat\n\n');

    jest.advanceTimersByTime(30000);
    expect(mockRes.write).toHaveBeenCalledTimes(4); // connected event(x2) + 2 heartbeats
  });
});