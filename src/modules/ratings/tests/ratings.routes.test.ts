import { ForbiddenError, BadRequestError, NotFoundError } from '@shared/errors';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../../app';
import { ratingsService } from '../ratings.service';


jest.mock('../ratings.service');

const mockToken = jwt.sign(
  { userId: 1, email: 'alice@example.com' },
  process.env.JWT_SECRET ?? 'test_secret'
);

const mockVoteResult = {
  vote: { id: 1, user_id: 1, target_id: 1, target_type: 'question', value: 1 },
  score: 1,
};

describe('Ratings Routes', () => {
  beforeEach(() => jest.clearAllMocks());


  
  describe('POST /api/votes', () => {
    it('should return 200 when vote is cast successfully', async () => {
      (ratingsService.castVote as jest.Mock).mockResolvedValue(mockVoteResult);

      const res = await request(app)
        .post('/api/votes')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ target_id: 1, target_type: 'question', value: 1 });

      expect(res.status).toBe(200);
      expect(res.body.data.score).toBe(1);
    });

    it('should return 401 without a token', async () => {
      const res = await request(app)
        .post('/api/votes')
        .send({ target_id: 1, target_type: 'question', value: 1 });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid vote value', async () => {
      const res = await request(app)
        .post('/api/votes')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ target_id: 1, target_type: 'question', value: 2 }); // invalid

      expect(res.status).toBe(400);
    });

    it('should return 403 if user votes on own content', async () => {
      (ratingsService.castVote as jest.Mock).mockRejectedValue(
        new ForbiddenError('You cannot vote on your own question')
      );

      const res = await request(app)
        .post('/api/votes')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ target_id: 1, target_type: 'question', value: 1 });

      expect(res.status).toBe(403);
    });

    it('should return 400 if same vote cast again', async () => {
      (ratingsService.castVote as jest.Mock).mockRejectedValue(
        new BadRequestError('You have already upvoted this question')
      );

      const res = await request(app)
        .post('/api/votes')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ target_id: 1, target_type: 'question', value: 1 });

      expect(res.status).toBe(400);
    });

    it('should return 404 if target does not exist', async () => {
      (ratingsService.castVote as jest.Mock).mockRejectedValue(
        new NotFoundError('Question not found')
      );

      const res = await request(app)
        .post('/api/votes')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ target_id: 999, target_type: 'question', value: 1 });

      expect(res.status).toBe(404);
    });
  });


  
  describe('DELETE /api/votes', () => {
    it('should return 200 when vote is removed successfully', async () => {
      (ratingsService.removeVote as jest.Mock).mockResolvedValue({ score: 0 });

      const res = await request(app)
        .delete('/api/votes')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ target_id: 1, target_type: 'question' });

      expect(res.status).toBe(200);
      expect(res.body.data.score).toBe(0);
    });

    it('should return 404 if vote does not exist', async () => {
      (ratingsService.removeVote as jest.Mock).mockRejectedValue(
        new NotFoundError('You have not voted on this question')
      );

      const res = await request(app)
        .delete('/api/votes')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ target_id: 1, target_type: 'question' });

      expect(res.status).toBe(404);
    });

    it('should return 401 without a token', async () => {
      const res = await request(app)
        .delete('/api/votes')
        .send({ target_id: 1, target_type: 'question' });

      expect(res.status).toBe(401);
    });
  });
});