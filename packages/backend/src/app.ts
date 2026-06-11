import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { adminRouter } from './routes/admin.route.js';
import { leaderRouter } from './routes/leader.route.js';
import { campaignRouter } from './routes/campaign.js';
import { userRouter } from './routes/user.route.js';
import { postRouter } from './routes/post.js';
import { teamRouter } from './routes/team.route.js';
import { accountRouter } from './routes/account.route.js';
import { verifyTokenRouter } from './routes/verify-token.js';
import { checkInRouter } from './routes/checkin.route.js';
import { uploadRouter } from './routes/upload.route.js';
import { campaignPhotoRouter } from './routes/campaignPhoto.route.js';

const app = express();

// Trust the first hop (nginx) so req.ip / X-Forwarded-* are correct in production
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/leader', leaderRouter);
app.use('/api/campaigns', campaignRouter);
app.use('/api/campaigns/:campaignId/photos', campaignPhotoRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/teams', teamRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/checkin', checkInRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api', verifyTokenRouter);

// Error handling
app.use(errorHandler);

export default app;
