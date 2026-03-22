import { EmailChannel } from '../channels/EmailChannel';
import { transporter } from '../../../config/mailer';
import { NotificationPayload } from '../types';

jest.mock('../../../config/mailer', () => ({
  transporter: { sendMail: jest.fn() },
}));

const mockPayload: NotificationPayload = {
  user: { id: 1, email: 'alice@example.com', username: 'alice' },
  message: 'Your question has a new answer',
  metadata: { questionId: 1 },
};

describe('EmailChannel', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should send an email to the user', async () => {
    (transporter.sendMail as jest.Mock).mockResolvedValue({});

    const channel = new EmailChannel();
    await channel.send(mockPayload);

    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'alice@example.com',
        subject: 'Your subscribed question has a new answer',
      })
    );
  });

  it('should throw if email sending fails', async () => {
    (transporter.sendMail as jest.Mock).mockRejectedValue(
      new Error('SMTP error')
    );

    const channel = new EmailChannel();
    await expect(channel.send(mockPayload)).rejects.toThrow('SMTP error');
  });
});