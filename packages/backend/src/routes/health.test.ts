import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /api/health', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.message).toBe('Server is running');
  });

  it('should return timestamp and uptime', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body.data.timestamp).toBeDefined();
    expect(typeof res.body.data.uptime).toBe('number');
  });
});
