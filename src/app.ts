import express, { Application, Request } from 'express';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

import { globalErrorHandler } from './shared/errors';
import { NotFoundError } from './shared/errors';
import { connectDB } from './config/db';
import { setupAssociations } from './models/associations';
import logger from './shared/logger';
import questionsRoutes from '@modules/questions/questions.routes';
import authRoutes from '@modules/auth/auth.routes';
import './shared/events';
import ratingsRoutes from '@modules/ratings/ratings.routes';
import subscriptionsRoutes from '@modules/subscriptions/subscriptions.routes';
import notificationsRoutes from '@modules/subscriptions/subscriptions.notification.routes';
import healthRoutes from '@modules/health/health.routes';

// Setup model associations
setupAssociations();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/votes', ratingsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Handle unmatched routes
app.all('/{*path}', (req: Request, _res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global error handler — must be last
app.use(globalErrorHandler);

const PORT = process.env.PORT ?? 3000;

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

// Only start the server when running directly, not when imported by tests
if (require.main === module) {
  startServer();
}

export default app;