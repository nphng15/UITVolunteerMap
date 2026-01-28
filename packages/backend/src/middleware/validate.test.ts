import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '@uit-volunteer-map/shared';

describe('Validation Middleware', () => {
  describe('Login Schema Validation', () => {
    it('should reject when username field is not sent', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'testpass' });

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
    });

    it('should reject when password field is not sent', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser' });

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
    });

    it('should reject when request body is empty', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('username:');
      expect(res.body.message).toContain('password:');
    });

    it('should trim whitespace from username and reject if only whitespace', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: '   ', password: 'testpass' });

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.message).toContain('Username is required');
    });
  });
});
