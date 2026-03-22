import { NotificationService } from '../NotificationService';
import { INotificationChannel, NotificationPayload } from '../types';

const mockPayload: NotificationPayload = {
  user: { id: 1, email: 'alice@example.com', username: 'alice' },
  message: 'Your question has a new answer',
  metadata: { questionId: 1 },
};

const createMockChannel = (shouldFail = false): INotificationChannel => ({
  send: jest.fn().mockImplementation(() =>
    shouldFail
      ? Promise.reject(new Error('Channel failed'))
      : Promise.resolve()
  ),
});

describe('NotificationService', () => {
  it('should call send on all channels', async () => {
    const channel1 = createMockChannel();
    const channel2 = createMockChannel();
    const service = new NotificationService([channel1, channel2]);

    await service.notify(mockPayload);

    expect(channel1.send).toHaveBeenCalledWith(mockPayload);
    expect(channel2.send).toHaveBeenCalledWith(mockPayload);
  });

  it('should not throw if one channel fails', async () => {
    const failingChannel = createMockChannel(true);
    const successChannel = createMockChannel();
    const service = new NotificationService([failingChannel, successChannel]);

    await expect(service.notify(mockPayload)).resolves.not.toThrow();

    expect(successChannel.send).toHaveBeenCalled();
  });

  it('should handle empty channels array gracefully', async () => {
    const service = new NotificationService([]);
    await expect(service.notify(mockPayload)).resolves.not.toThrow();
  });
});