# StackOverflow Clone API

A RESTful API clone of core StackOverflow functionality built with Node.js, TypeScript, Express, MySQL, and Sequelize.

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/femiayodeji/stackoverflow-clone.git
cd stackoverflow-clone
```

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture & Design Patterns](#architecture--design-patterns)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Environment Setup](#environment-setup)
6. [Running the Application](#running-the-application)
7. [Database Setup](#database-setup)
8. [Running Tests](#running-tests)
9. [API Endpoints](#api-endpoints)
10. [Postman Collection](#postman-collection)
11. [Real-time Notifications (SSE)](#real-time-notifications-sse)
12. [Assumptions](#assumptions)
13. [Production Considerations](#production-considerations)
14. [Known Issues](#known-issues)
15. [Feedback](#feedback)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Language | TypeScript |
| Framework | Express |
| ORM | Sequelize |
| Database | MySQL 8.0 |
| Authentication | JWT (jsonwebtoken) |
| Validation | Zod |
| Logging | Winston |
| Email | Nodemailer |
| Real-time | Server-Sent Events (SSE) |
| Testing | Jest + Supertest |
| Containerization | Docker + Docker Compose |

---

## Architecture & Design Patterns

### Design Patterns Used

| Pattern | Location | Purpose |
|---|---|---|
| **Observer** | `questionEmitter` + `answer.observer` | Decouples answer creation from notification delivery |
| **Strategy** | `INotificationChannel`, `InAppChannel`, `EmailChannel`, `SSEChannel` | Interchangeable notification channels behind a common interface |
| **Singleton** | `questionEmitter`, `notificationService`, `db`, `mailer`, `logger`, `sseRegistry` | Ensures shared state across the app |
| **Repository** | `*.repository.ts` | Abstracts all DB interaction from services |
| **Service Layer** | `*.service.ts` | Isolates business logic from HTTP and data access concerns |
| **Chain of Responsibility** | Express middleware chain (`protect → validate → controller`) | Separates auth, validation, and business logic concerns |
| **Factory** | `notifications/index.ts` | Composes the NotificationService with the correct channels |
| **Middleware/Decorator** | `catchAsync.ts` | Wraps async controllers to forward errors without try/catch boilerplate |
| **Template Method** | `AppError` + `HttpError` subclasses | Consistent error shape across all modules |

### Notification Pipeline
```
POST /api/questions/:id/answers
         │
         ▼
questions.service.createAnswer()
         │
         ├── saves answer to DB
         └── questionEmitter.emit('answer.posted')
                    │
                    ▼
            answer.observer
                    │
                    └── notificationService.notify() per subscriber
                                 │
                                 ├──▶ InAppChannel  → DB row (always)
                                 ├──▶ EmailChannel  → nodemailer (always)
                                 └──▶ SSEChannel    → push to client (if connected)
```

---

## Project Structure
```
src/
├── app.ts                         # Express app entry point
├── config/                        # DB, mailer config
├── database/
│   ├── config/                    # Sequelize CLI config
│   ├── migrations/                # Table creation migrations
│   └── seeders/                   # Seed data
├── docs/                          # API documentation
├── middleware/                    # auth + validate middleware
├── models/                        # Sequelize models + associations
├── modules/
│   ├── auth/                      # Register, login
│   ├── health/                    # Health check endpoint
│   ├── questions/                 # Questions + answers
│   ├── ratings/                   # Upvote/downvote
│   └── subscriptions/             # Subscriptions + notifications + SSE
├── shared/
│   ├── errors/                    # AppError, HttpError, catchAsync, globalErrorHandler
│   ├── events/                    # EventEmitter + observers
│   ├── logger/                    # Winston logger + transports
│   ├── notifications/             # NotificationService + channels
│   ├── pagination/                # Pagination utilities
│   └── sse/                       # SSERegistry
└── tests/                         # Test setup + teardown
```

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) : recommended
- Or locally: Node.js 20+, MySQL 8.0

---

## Environment Setup

Copy the example environment file and fill in your values:
```bash
cp .env.example .env
```

### `.env` variables
```bash
# App
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DB_HOST=localhost        # use 'mysql' if connecting outside Docker to the container
DB_PORT=3306
DB_NAME=stackoverflow_clone
DB_USER=root
DB_PASSWORD=yourpassword
DB_DIALECT=mysql

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Logger
LOG_LEVEL=info
LOG_TO_FILE=true
LOG_FILE_PATH=logs/app.log
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
SLACK_LOG_LEVEL=error

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SMTP_FROM=no-reply@stackclone.com
```

---

## Running the Application

### With Docker (recommended)
```bash
# Start app + MySQL, run migrations and seed automatically
docker compose up --build

# Stop
docker compose down

# Full reset : wipes DB and starts fresh
docker compose down -v && docker compose up --build

# View app logs
docker compose logs -f app
```

App will be available at `http://localhost:3000`

### Without Docker
```bash
# Install dependencies
npm install

# Make sure MySQL is running and your .env DB values are correct, then:
npm run db:create
npm run db:migrate
npm run db:seed

# Start with hot reload
npm run dev
```

---

## Database Setup

### Scripts

| Command | Description |
|---|---|
| `npm run db:create` | Creates the database |
| `npm run db:migrate` | Runs all pending migrations |
| `npm run db:rollback` | Rolls back all migrations |
| `npm run db:seed` | Seeds the database with test data |
| `npm run db:seed:undo` | Removes all seed data |
| `npm run db:fresh` | Full rollback + migrate + seed |

### Seed Data

The seeders create the following test data:

| Entity | Count |
|---|---|
| Users | 5 |
| Questions | 10 |
| Answers | 10 |
| Votes | 10 |
| Subscriptions | 5 |

All seeded users share the same password: `Password123!`

| Username | Email |
|---|---|
| alice | alice@example.com |
| bob | bob@example.com |
| charlie | charlie@example.com |
| diana | diana@example.com |
| eve | eve@example.com |

---

## Running Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Types

- **Unit tests**: Test individual services, utilities, and logic in isolation (e.g., `*.service.test.ts`, `AppError.test.ts`).
- **Integration tests**: Test API endpoints and modules end-to-end, including database and middleware (e.g., `*.routes.test.ts`).

### Run tests inside Docker
```bash
docker compose exec app npm test
```

### Test Coverage Target

The project targets **85% coverage** across all modules as required. Coverage report is generated in `/coverage`.

---

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login and receive JWT |

### Questions & Answers

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/questions` | ❌ | List all questions |
| GET | `/api/questions/:id` | ❌ | Get question with answers |
| POST | `/api/questions` | ✅ | Ask a new question |
| POST | `/api/questions/:id/answers` | ✅ | Post an answer |

### Ratings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/votes` | ✅ | Cast or update a vote |
| DELETE | `/api/votes` | ✅ | Remove a vote |

### Subscriptions & Notifications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/subscriptions` | ✅ | Subscribe to a question |
| DELETE | `/api/subscriptions/:questionId` | ✅ | Unsubscribe from a question |
| GET | `/api/notifications` | ✅ | Get all notifications |
| PATCH | `/api/notifications/:id/read` | ✅ | Mark notification as read |
| GET | `/api/notifications/stream` | ✅ | Open SSE stream |

### Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

### Response Shape

All responses follow a consistent shape:

**Success**
```json
{
  "status": "success",
  "data": {}
}
```

**Error**
```json
{
  "status": "fail",
  "statusCode": 400,
  "message": "Descriptive error message"
}
```

---

## Postman Collection

A Postman collection is included at `postman/stackoverflow-clone.postman_collection.json`.

**Import:** Open Postman → Import → select the file.

The collection includes all endpoints with example requests.

---

## Real-time Notifications (SSE)

Subscribers receive instant push notifications when a question they subscribed to gets a new answer via Server-Sent Events.

### Connecting
```js
const source = new EventSource('http://localhost:3000/api/notifications/stream', {
  headers: { Authorization: `Bearer ${token}` }
});

// Connection established
source.addEventListener('connected', (e) => {
  console.log(JSON.parse(e.data).message);
});

// Incoming notification
source.addEventListener('notification', (e) => {
  const { message, questionId, timestamp } = JSON.parse(e.data);
  console.log(message);
});
```

### Behaviour

- If the user is **connected** via SSE when an answer is posted : they receive an instant push notification
- If the user is **not connected** : the notification is persisted to the DB and available via `GET /api/notifications` on their next visit
- A **heartbeat** is sent every 30 seconds to keep the connection alive

---

## Assumptions

1. **Authentication scope** : JWT access tokens only. Refresh tokens were out of scope but the architecture supports adding them without structural changes.

2. **Vote ownership** : Users cannot vote on their own questions or answers. Users cannot subscribe to their own questions.

3. **Answer ownership** : Users cannot answer their own questions.

4. **Integer primary keys** : Chosen over UUIDs for MySQL performance reasons. MySQL stores UUIDs as `CHAR(36)` causing B-tree fragmentation on inserts. In a production environment with distributed writes or public-facing IDs, a hybrid approach : integer PK internally, UUID as a public identifier : would be preferable.

5. **Notification delivery** : `Promise.allSettled` ensures a failure in one channel (e.g. SMTP down) never prevents other channels from delivering. Notifications are not retried on failure.

6. **SSE scaling** : The SSERegistry is an in-memory map. In a horizontally scaled environment with multiple server instances, a user connected to server A would not receive events emitted on server B. Redis pub/sub would be the solution at that scale.

7. **Email in development** : Mailtrap is assumed for development SMTP. No emails are sent to real addresses during development.

---

## Production Considerations

The following improvements would be made before taking this to production:

| Concern | Recommendation |
|---|---|
| **Message queue** | RabbitMQ for reliable async notification delivery with retry logic |
| **Job scheduling** | Agenda.js for scheduled or retryable notification jobs |
| **SSE at scale** | Redis pub/sub to broadcast events across multiple server instances |
| **UUID public IDs** | Integer PK internally + UUID as public-facing identifier |
| **Refresh tokens** | Short-lived access tokens + refresh token rotation |
| **Rate limiting** | express-rate-limit on auth and vote endpoints |
| **Database** | PostgreSQL for better UUID support, full-text search on questions |
| **Bulk notifications** | Use Sequelize `bulkCreate` for in-app notifications; chunk or delegate email to SendGrid for high subscriber counts |

---

## Known Issues

None at time of submission.

---

## Feedback

1. **Notification channels** : Clarify whether email or in-app only is expected. Affects SMTP setup and library choices.

2. **Non-functional requirements** : Include expected load, scalability, and availability targets. These drive decisions around message queues, real-time architecture, horizontal scaling, and database choice.