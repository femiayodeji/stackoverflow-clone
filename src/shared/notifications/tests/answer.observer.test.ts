import { Subscription } from '@models/subscription.model';
import { questionEmitter } from '@shared/events/questionEmitter';
import { notificationService } from '..';

jest.mock('../../notifications', () => ({
  notificationService: { notify: jest.fn() },
}));

jest.mock('@models/subscription.model');

// Register observer
import '../../events/observers/answer.observer';

describe('answer.observer', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should notify all subscribers when answer.posted is emitted', async () => {
    (Subscription.findAll as jest.Mock).mockResolvedValue([
      {
        question_id: 1,
        user: { id: 2, email: 'bob@example.com', username: 'bob' },
      },
    ]);

    (notificationService.notify as jest.Mock).mockResolvedValue(undefined);

    questionEmitter.emit('answer.posted', {
      answerId: 1,
      questionId: 1,
      answererName: 'alice',
    });

    // Allow async observer to complete
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(notificationService.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ id: 2 }),
        metadata: { questionId: 1 },
      })
    );
  });

  it('should do nothing if there are no subscribers', async () => {
    (Subscription.findAll as jest.Mock).mockResolvedValue([]);

    questionEmitter.emit('answer.posted', {
      answerId: 1,
      questionId: 1,
      answererName: 'alice',
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(notificationService.notify).not.toHaveBeenCalled();
  });
});