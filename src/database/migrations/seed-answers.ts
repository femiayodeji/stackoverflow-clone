import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const [existing] = await queryInterface.sequelize.query(
    `SELECT COUNT(*) as count FROM answers`
  ) as any;

  if (existing[0].count > 0) return;

  await queryInterface.bulkInsert('answers', [
    { question_id: 1, user_id: 2, body: 'The event loop is what allows Node.js to perform non-blocking I/O operations. It continuously checks the call stack and the callback queue, pushing callbacks onto the stack when it is empty.', created_at: new Date(), updated_at: new Date() },
    { question_id: 1, user_id: 3, body: 'Think of it this way — Node.js runs on a single thread but delegates I/O to the OS. When the OS finishes, it places the callback in the queue and the event loop picks it up.', created_at: new Date(), updated_at: new Date() },
    { question_id: 2, user_id: 1, body: 'SQL databases enforce a strict schema and support ACID transactions — great for financial data. NoSQL trades consistency for flexibility and horizontal scaling — great for unstructured or rapidly changing data.', created_at: new Date(), updated_at: new Date() },
    { question_id: 3, user_id: 5, body: 'The modern way is to use flexbox: set the parent to display:flex, justify-content:center, and align-items:center. Grid works too with place-items:center.', created_at: new Date(), updated_at: new Date() },
    { question_id: 4, user_id: 1, body: 'Generics let you write reusable functions and classes that work with any type while preserving type safety. A classic example is a typed API response wrapper: ApiResponse<T> where T is the data shape.', created_at: new Date(), updated_at: new Date() },
    { question_id: 5, user_id: 3, body: 'JWT works by encoding a payload into a signed token. The server signs it with a secret; any tampered token fails verification. Store it in httpOnly cookies in production, never in localStorage.', created_at: new Date(), updated_at: new Date() },
    { question_id: 6, user_id: 4, body: 'Promise.all fails fast — if any promise rejects, the whole thing rejects. Promise.allSettled waits for all promises regardless and returns each result individually, perfect when you need all outcomes.', created_at: new Date(), updated_at: new Date() },
    { question_id: 7, user_id: 2, body: 'Indexes are typically B-tree structures that let the DB find rows without scanning the whole table. Add them on columns you filter or sort by frequently, but be careful — they slow down writes.', created_at: new Date(), updated_at: new Date() },
    { question_id: 8, user_id: 5, body: 'The Repository pattern abstracts your data layer behind an interface. Your service talks to the repository, not the ORM directly. This makes swapping databases or mocking in tests trivial.', created_at: new Date(), updated_at: new Date() },
    { question_id: 9, user_id: 1, body: 'Wrap your async route handlers with a catchAsync utility that forwards errors to next(). Then register a global error handler middleware at the bottom of your Express app.', created_at: new Date(), updated_at: new Date() },
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('answers', {});
}