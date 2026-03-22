import { SSEChannel } from '../channels/SSEChannel';
import { sseRegistry } from '../../sse/SSERegistry';
import { NotificationPayload } from '../types';

jest.mock('../../sse/SSERegistry', () => ({
  sseRegistry: {
    isConnected: jest.fn(),
    send: jest.fn(),
  },
}));

const mockPayload: NotificationPayload = {
  user: { id: 1, email: 'alice@example.com', username: 'alice' },
  message: 'Your subscribed question has a new answer',
  metadata: { questionId: 1 },
};

describe('SSEChannel', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should push SSE event if user is connected', async () => {
    (sseRegistry.isConnected as jest.Mock).mockReturnValue(true);

    const channel = new SSEChannel();
    await channel.send(mockPayload);

    expect(sseRegistry.send).toHaveBeenCalledWith(
      1,
      'notification',
      expect.objectContaining({
        message: 'Your subscribed question has a new answer',
        questionId: 1,
      })
    );
  });

  it('should skip if user is not connected', async () => {
    (sseRegistry.isConnected as jest.Mock).mockReturnValue(false);

    const channel = new SSEChannel();
    await channel.send(mockPayload);

    expect(sseRegistry.send).not.toHaveBeenCalled();
  });
});