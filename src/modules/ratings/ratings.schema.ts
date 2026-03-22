import { z } from 'zod';

export const CastVoteSchema = z.object({
  target_id: z.number({ message: 'Target ID is required' }).int().positive(),
  target_type: z.enum(['question', 'answer'], {
    message: 'Target type must be either question or answer',
  }),
  value: z.union([z.literal(1), z.literal(-1)], {
    message: 'Value must be either 1 (upvote) or -1 (downvote)',
  }),
});

export const RemoveVoteSchema = z.object({
  target_id: z.number({ message: 'Target ID is required' }).int().positive(),
  target_type: z.enum(['question', 'answer'], {
    message: 'Target type must be either question or answer',
  }),
});

export type CastVoteDto = z.infer<typeof CastVoteSchema>;
export type RemoveVoteDto = z.infer<typeof RemoveVoteSchema>;