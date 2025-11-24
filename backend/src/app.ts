import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './auth/auth.routes';
import folderRoutes from './folders/folder.routes';
import fileRoutes from './files/file.routes';
import bookmarkRoutes from './files/bookmark.routes';
import orderRoutes from './files/order.routes';
import userRoutes from './users/user.routes';
import announcementRoutes from './misc/announcement.routes';
import userStatsRoutes from './users/user.stats.routes';
import uploadRoutes from './misc/upload.routes';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api', folderRoutes);
app.use('/api', fileRoutes);
app.use('/api', bookmarkRoutes);
app.use('/api', orderRoutes);
app.use('/api', userRoutes);
app.use('/api', announcementRoutes);
app.use('/api', userStatsRoutes);
app.use('/api', uploadRoutes);

app.use(errorHandler);

export default app;
