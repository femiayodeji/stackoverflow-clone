import { Vote, VoteTargetType } from '@models/vote.model';

export class RatingsRepository {
  async findVote(
    userId: number,
    targetId: number,
    targetType: VoteTargetType
  ): Promise<Vote | null> {
    return Vote.findOne({
      where: { user_id: userId, target_id: targetId, target_type: targetType },
    });
  }

  async createVote(
    userId: number,
    targetId: number,
    targetType: VoteTargetType,
    value: 1 | -1
  ): Promise<Vote> {
    return Vote.create({
      user_id: userId,
      target_id: targetId,
      target_type: targetType,
      value,
    });
  }

  async updateVote(vote: Vote, value: 1 | -1): Promise<Vote> {
    return vote.update({ value });
  }

  async deleteVote(vote: Vote): Promise<void> {
    await vote.destroy();
  }

  async getScore(
    targetId: number,
    targetType: VoteTargetType
  ): Promise<number> {
    const votes = await Vote.findAll({
      where: { target_id: targetId, target_type: targetType },
    });
    return votes.reduce((sum, vote) => sum + vote.value, 0);
  }
}

export const ratingsRepository = new RatingsRepository();