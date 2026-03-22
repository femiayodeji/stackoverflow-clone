import { z } from 'zod';

export const SubscribeSchema = z.object({
  question_id: z
    .number({ message: 'Question ID is required' })
    .int()
    .positive(),
});

export type SubscribeDto = z.infer<typeof SubscribeSchema>;