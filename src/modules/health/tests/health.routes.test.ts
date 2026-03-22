import request from 'supertest';
import app from '@/app';

describe('Health Routes', () => {
  describe('GET /health', () => {
    it('should return 200 with healthy status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.timestamp).toBeDefined();
    });

    it('should return a valid ISO timestamp', async () => {
      const res = await request(app).get('/health');

      const timestamp = new Date(res.body.timestamp);
      expect(timestamp.toISOString()).toBe(res.body.timestamp);
    });
  });
});
