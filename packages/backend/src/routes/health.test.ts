import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { HTTP_STATUS, HEALTH_MESSAGES } from '@uit-volunteer-map/shared';

describe('GET /api/health', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(HEALTH_MESSAGES.STATUS_HEALTHY);
    expect(res.body.message).toBe(HEALTH_MESSAGES.SERVER_RUNNING);
  });

  it('should return timestamp and uptime', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body.data.timestamp).toBeDefined();
    expect(typeof res.body.data.uptime).toBe('number');
  });
});
