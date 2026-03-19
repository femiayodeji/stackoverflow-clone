import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const [existing] = await queryInterface.sequelize.query(
    `SELECT COUNT(*) as count FROM questions`
  ) as any;

  if (existing[0].count > 0) return;

  await queryInterface.bulkInsert('questions', [
    { user_id: 1, title: 'How does the event loop work in Node.js?', body: 'I keep hearing about the event loop in Node.js but I am struggling to understand how it works under the hood. Can someone explain it clearly?', created_at: new Date(), updated_at: new Date() },
    { user_id: 2, title: 'What is the difference between SQL and NoSQL?', body: 'When should I choose a relational database over a NoSQL one? What are the trade-offs?', created_at: new Date(), updated_at: new Date() },
    { user_id: 1, title: 'How do I center a div in CSS?', body: 'I have tried multiple approaches but I cannot get my div to center both horizontally and vertically. What is the modern way to do this?', created_at: new Date(), updated_at: new Date() },
    { user_id: 3, title: 'What are TypeScript generics and when should I use them?', body: 'I understand basic TypeScript types but generics confuse me. Can someone give practical examples of when they are useful?', created_at: new Date(), updated_at: new Date() },
    { user_id: 4, title: 'How does JWT authentication work?', body: 'I want to implement authentication in my REST API. How does JWT work and is it secure enough for production?', created_at: new Date(), updated_at: new Date() },
    { user_id: 2, title: 'What is the difference between Promise.all and Promise.allSettled?', body: 'I know both deal with multiple promises but I am not sure when to use one over the other.', created_at: new Date(), updated_at: new Date() },
    { user_id: 5, title: 'How do database indexes work?', body: 'I know indexes make queries faster but I want to understand how they work internally and when I should add them.', created_at: new Date(), updated_at: new Date() },
    { user_id: 3, title: 'What is the Repository pattern?', body: 'I keep seeing the Repository pattern mentioned in backend architecture discussions. What problem does it solve?', created_at: new Date(), updated_at: new Date() },
    { user_id: 4, title: 'How do I handle errors in async Express routes?', body: 'My Express app crashes when an async route throws. What is the correct way to handle errors in async middleware?', created_at: new Date(), updated_at: new Date() },
    { user_id: 5, title: 'What is the CAP theorem?', body: 'I have heard about CAP theorem in distributed systems. Can someone explain it with a practical example?', created_at: new Date(), updated_at: new Date() },
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('questions', {});
}