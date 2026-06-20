import axios from 'axios';
import apiClient, {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '@/lib/api/client';

// Mock axios
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
  };
  return mockAxios;
});

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Token management', () => {
    it('getAccessToken returns null when not set', () => {
      expect(getAccessToken()).toBeNull();
    });

    it('getRefreshToken returns null when not set', () => {
      expect(getRefreshToken()).toBeNull();
    });

    it('setTokens stores tokens in localStorage', () => {
      setTokens({
        access_token: 'test-access',
        refresh_token: 'test-refresh',
        token_type: 'bearer',
        expires_in: 3600,
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'test-access');
      expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', 'test-refresh');
    });

    it('clearTokens removes tokens from localStorage', () => {
      clearTokens();

      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('Axios instance', () => {
    it('creates axios instance with correct config', () => {
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        })
      );
    });

    it('registers request interceptor', () => {
      expect(axios.create().interceptors.request.use).toHaveBeenCalled();
    });

    it('registers response interceptor', () => {
      expect(axios.create().interceptors.response.use).toHaveBeenCalled();
    });
  });
});