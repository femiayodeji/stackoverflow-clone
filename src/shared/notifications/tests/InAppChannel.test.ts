import { Notification } from "@models/notification.model";
import { InAppChannel } from "../channels/InAppChannel";
import { NotificationPayload } from "../types";

jest.mock('@models/notification.model');

const mockPayload: NotificationPayload = {
  user: { id: 1, email: 'alice@example.com', username: 'alice' },
  message: 'Your question has a new answer',
  metadata: { questionId: 1 },
};

describe('InAppChannel', () => {
  it('should create a notification record in the database', async () => {
    (Notification.create as jest.Mock).mockResolvedValue({});

    const channel = new InAppChannel();
    await channel.send(mockPayload);

    expect(Notification.create).toHaveBeenCalledWith({
      user_id: 1,
      question_id: 1,
      message: 'Your question has a new answer',
    });
  });

  it('should throw if database write fails', async () => {
    (Notification.create as jest.Mock).mockRejectedValue(
      new Error('DB write failed')
    );

    const channel = new InAppChannel();
    await expect(channel.send(mockPayload)).rejects.toThrow('DB write failed');
  });
});