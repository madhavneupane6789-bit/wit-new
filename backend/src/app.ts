import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './auth/auth.routes';
import folderRoutes from './folders/folder.routes';
import fileRoutes from './files/file.routes';
import bookmarkRoutes from './files/bookmark.routes';
import orderRoutes from './files/order.routes';
import userRoutes from './users/user.routes';
import announcementRoutes from './misc/announcement.routes';
import userStatsRoutes from './users/user.stats.routes';
import uploadRoutes from './misc/upload.routes';
import syllabusRoutes from './syllabus/syllabus.routes';
import mcqRoutes from './mcq/mcq.routes';
import mediaRoutes from './misc/media.routes';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin || 'https://witnea.onrender.com',
    credentials: true,
  }),
);

// Logging Middleware
app.use(morgan('dev'));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);


app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api', folderRoutes);
app.use('/api', fileRoutes);
app.use('/api', bookmarkRoutes);
app.use('/api', orderRoutes);
app.use('/api', userRoutes);
app.use('/api', announcementRoutes);
app.use('/api', userStatsRoutes);
app.use('/api', uploadRoutes);
app.use('/api', syllabusRoutes);
app.use('/api', mcqRoutes);
app.use('/api', mediaRoutes);

app.use(errorHandler);

export default app;