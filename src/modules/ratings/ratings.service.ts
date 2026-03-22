import { ratingsRepository } from './ratings.repository';
import { CastVoteDto, RemoveVoteDto } from './ratings.schema';
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from '@shared/errors';
import { Vote } from '@models/vote.model';
import { Question } from '@models/question.model';
import { Answer } from '@models/answer.model';
import logger from '@shared/logger';

export interface VoteResult {
  vote: Vote;
  score: number;
}

export class RatingsService {
  async castVote(userId: number, dto: CastVoteDto): Promise<VoteResult> {
    const { target_id, target_type, value } = dto;

    // Verify target exists and user does not own it
    await this.validateTarget(userId, target_id, target_type);

    const existingVote = await ratingsRepository.findVote(
      userId,
      target_id,
      target_type
    );

    let vote: Vote;

    if (existingVote) {
      if (existingVote.value === value) {
        throw new BadRequestError(
          `You have already ${value === 1 ? 'upvoted' : 'downvoted'} this ${target_type}`
        );
      }
      // User is switching their vote
      vote = await ratingsRepository.updateVote(existingVote, value);
      logger.info('Vote updated', { userId, target_id, target_type, value });
    } else {
      vote = await ratingsRepository.createVote(
        userId,
        target_id,
        target_type,
        value
      );
      logger.info('Vote cast', { userId, target_id, target_type, value });
    }

    const score = await ratingsRepository.getScore(
      target_id,
      target_type
    );

    return { vote, score };
  }

  async removeVote(userId: number, dto: RemoveVoteDto): Promise<{ score: number }> {
    const { target_id, target_type } = dto;

    const existingVote = await ratingsRepository.findVote(
      userId,
      target_id,
      target_type
    );

    if (!existingVote) {
      throw new NotFoundError('You have not voted on this ' + target_type);
    }

    await ratingsRepository.deleteVote(existingVote);

    logger.info('Vote removed', { userId, target_id, target_type });

    const score = await ratingsRepository.getScore(
      target_id,
      target_type
    );

    return { score };
  }

  private async validateTarget(
    userId: number,
    targetId: number,
    targetType: 'question' | 'answer'
  ): Promise<void> {
    if (targetType === 'question') {
      const question = await Question.findByPk(targetId);
      if (!question) throw new NotFoundError('Question not found');
      if (question.user_id === userId) {
        throw new ForbiddenError('You cannot vote on your own question');
      }
    } else {
      const answer = await Answer.findByPk(targetId);
      if (!answer) throw new NotFoundError('Answer not found');
      if (answer.user_id === userId) {
        throw new ForbiddenError('You cannot vote on your own answer');
      }
    }
  }
}

export const ratingsService = new RatingsService();