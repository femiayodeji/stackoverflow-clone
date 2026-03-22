import { z } from 'zod';

export const SubscribeSchema = z.object({
  question_id: z
    .number({ message: 'Question ID is required' })
    .int()
    .positive(),
});

export const NotificationParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid notification ID'),
});

export type SubscribeDto = z.infer<typeof SubscribeSchema>;