import request from 'supertest';
import { app } from '../src/index';

describe('Server API', () => {
  describe('GET /health', () => {
    it('should return 200 with status ok', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        message: 'Server is running'
      });
    });
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Welcome to Orbital CLI AI API'
      });
    });
  });
});
