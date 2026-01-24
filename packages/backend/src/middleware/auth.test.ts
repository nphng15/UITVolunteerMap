import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import app from '../app.js';
import { AppDataSource } from '../db/data-source.js';
import { Account } from '../entities/Account.js';
import { Role } from '../entities/Role.js';
import { User } from '../entities/User.js';
import { Campaign } from '../entities/Campaign.js';
import { Team } from '../entities/Team.js';
import { Post } from '../entities/Post.js';
import { Photo } from '../entities/Photo.js';

// Use the same secret as vitest.config.ts
const JWT_SECRET = process.env.JWT_SECRET!;

describe('Auth Middleware', () => {
  let adminToken: string;
  let leaderToken: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.setOptions({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: false,
        entities: [Account, Role, User, Campaign, Team, Post, Photo],
        migrations: [],
        subscribers: [],
      }).initialize();
    } else {
      await AppDataSource.synchronize(true);
    }

    const roleRepo = AppDataSource.getRepository(Role);
    const accRepo = AppDataSource.getRepository(Account);

    const adminRole = await roleRepo.save({ roleName: 'admin' });
    const leaderRole = await roleRepo.save({ roleName: 'leader' });

    const adminPass = await bcrypt.hash('admin123', 10);
    const leaderPass = await bcrypt.hash('leader123', 10);

    const adminAcc = await accRepo.save({
      username: 'admin',
      password: adminPass,
      roleId: adminRole.roleId,
    });

    const leaderAcc = await accRepo.save({
      username: 'leader',
      password: leaderPass,
      roleId: leaderRole.roleId,
    });

    adminToken = jwt.sign(
      { accId: adminAcc.accId, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    leaderToken = jwt.sign(
      { accId: leaderAcc.accId, role: 'leader' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('authenticateToken', () => {
    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/admin/admin-only');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when token is invalid', async () => {
      const res = await request(app)
        .get('/api/admin/admin-only')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Invalid or expired token');
    });

    it('should return 403 when token is expired', async () => {
      const expiredToken = jwt.sign(
        { accId: 1, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '-1s' }
      );

      const res = await request(app)
        .get('/api/admin/admin-only')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Invalid or expired token');
    });

    it('should return 401 when Authorization header is malformed', async () => {
      const res = await request(app)
        .get('/api/admin/admin-only')
        .set('Authorization', 'InvalidFormat');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access token required');
    });
  });

  describe('requireRole', () => {
    it('should allow admin to access admin-only route', async () => {
      const res = await request(app)
        .get('/api/admin/admin-only')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Message by admin');
    });

    it('should deny leader from accessing admin-only route', async () => {
      const res = await request(app)
        .get('/api/admin/admin-only')
        .set('Authorization', `Bearer ${leaderToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Permission denied');
    });

    it('should allow leader to access leader-only route', async () => {
      const res = await request(app)
        .get('/api/leader/leader-only')
        .set('Authorization', `Bearer ${leaderToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Message by leader');
    });

    it('should deny admin from accessing leader-only route', async () => {
      const res = await request(app)
        .get('/api/leader/leader-only')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Permission denied');
    });
  });
});
