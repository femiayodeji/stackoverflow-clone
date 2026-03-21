import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { globalErrorHandler } from './shared/errors';
import { NotFoundError } from './shared/errors';
import { connectDB } from './config/db';
import authRoutes from './modules/auth/auth.routes';
import logger from './shared/logger';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Handle unmatched routes
app.all('*', (req: Request, _res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global error handler — must be last
app.use(globalErrorHandler);

const PORT = process.env.PORT ?? 3000;

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`API docs available at http://localhost:${PORT}/api/docs`);
  });
};

startServer();

export default app;