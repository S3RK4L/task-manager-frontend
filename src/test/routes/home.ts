import axios from 'axios';
import request from 'supertest';

import { app } from '../../main/app';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Home page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('on GET', () => {
    test('should render the task list with a 200 response code', async () => {
      mockedAxios.get.mockResolvedValue({
        data: [
          {
            id: 1,
            title: 'Review case bundle',
            description: 'Check the bundle is complete',
            status: 'IN_PROGRESS',
            dueDate: '2026-11-10T09:00:00',
          },
        ],
      });

      const response = await request(app).get('/').expect(200);

      expect(response.text).toContain('Review case bundle');
      expect(response.text).toContain('In progress');
      expect(response.text).toContain('10 November 2026 at 09:00');
    });

    test('should render an error page with a 500 response code when the backend is unavailable', async () => {
      mockedAxios.get.mockRejectedValue(new Error('ECONNREFUSED'));

      const response = await request(app).get('/').expect(500);

      expect(response.text).toContain('Failed to load tasks');
    });
  });
});
