import EventEmitter from 'events';

export interface QuestionEvents {
  'answer.posted': {
    answerId: number;
    questionId: number;
    answererName: string;
  };
}

class QuestionEmitter extends EventEmitter {
  emit<K extends keyof QuestionEvents>(
    event: K,
    payload: QuestionEvents[K]
  ): boolean {
    return super.emit(event, payload);
  }

  on<K extends keyof QuestionEvents>(
    event: K,
    listener: (payload: QuestionEvents[K]) => void
  ): this {
    return super.on(event, listener);
  }
}

// Singleton — every module imports the same instance
export const questionEmitter = new QuestionEmitter();