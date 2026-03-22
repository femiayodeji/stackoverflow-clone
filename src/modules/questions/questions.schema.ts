import { z } from 'zod';

export const CreateQuestionSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(150, 'Title must not exceed 150 characters'),
  body: z
    .string()
    .min(20, 'Body must be at least 20 characters'),
});

export const CreateAnswerSchema = z.object({
  body: z
    .string()
    .min(10, 'Answer must be at least 10 characters'),
});

export type CreateQuestionDto = z.infer<typeof CreateQuestionSchema>;
export type CreateAnswerDto = z.infer<typeof CreateAnswerSchema>;