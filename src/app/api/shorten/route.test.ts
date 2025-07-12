import { POST } from './route';
import { NextRequest } from 'next/server';
import * as data from '@/lib/data';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { UserRecord } from 'firebase-admin/auth';

// Mock the data module
vi.mock('@/lib/data', async () => {
    const actual = await vi.importActual('@/lib/data');
    return {
        ...actual,
        validateApiKey: vi.fn(),
        checkRateLimit: vi.fn(),
        createShortLink: vi.fn(),
        incrementUsage: vi.fn(),
    };
});

const mockValidateApiKey = data.validateApiKey as vi.Mock;
const mockCheckRateLimit = data.checkRateLimit as vi.Mock;
const mockCreateShortLink = data.createShortLink as vi.Mock;
const mockIncrementUsage = data.incrementUsage as vi.Mock;

describe('POST /api/shorten', () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    const mockUser = { uid: 'test-user-id', emailVerified: true } as UserRecord;

    it('should return a shortened URL on success', async () => {
        mockValidateApiKey.mockResolvedValue(mockUser);
        mockCheckRateLimit.mockResolvedValue(true);
        mockCreateShortLink.mockResolvedValue({ id: 'abcdef', longUrl: 'https://example.com', createdAt: Date.now(), expiresAt: -1, userId: 'test-user-id', clickCount: 0 });

        const request = new NextRequest('https://minifyn.com/api/shorten', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer valid-token' },
            body: JSON.stringify({ url: 'https://example.com' }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({
            message: 'URL shortened successfully',
            shortUrl: 'https://mnfy.in/abcdef',
        });
        expect(mockIncrementUsage).toHaveBeenCalledWith(mockUser.uid);
    });

    it('should return 401 Unauthorized if token is invalid', async () => {
        mockValidateApiKey.mockResolvedValue(null);

        const request = new NextRequest('https://minifyn.com/api/shorten', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer invalid-token' },
            body: JSON.stringify({ url: 'https://example.com' }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toEqual({ error: 'Unauthorized' });
    });
    
    it('should return 401 Unauthorized if Authorization header is missing', async () => {
        const request = new NextRequest('https://minifyn.com/api/shorten', {
            method: 'POST',
            body: JSON.stringify({ url: 'https://example.com' }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toEqual({ error: 'Unauthorized' });
    });


    it('should return 400 Bad Request if URL is invalid', async () => {
        mockValidateApiKey.mockResolvedValue(mockUser);
        mockCheckRateLimit.mockResolvedValue(true);

        const request = new NextRequest('https://minifyn.com/api/shorten', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer valid-token' },
            body: JSON.stringify({ url: 'not-a-valid-url' }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({ error: 'Please enter a valid URL.' });
    });

    it('should return 429 Too Many Requests if rate limit is exceeded', async () => {
        mockValidateApiKey.mockResolvedValue(mockUser);
        mockCheckRateLimit.mockResolvedValue(false);

        const request = new NextRequest('https://minifyn.com/api/shorten', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer valid-token' },
            body: JSON.stringify({ url: 'https://example.com' }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(429);
        expect(body).toEqual({ error: 'Rate limit exceeded' });
    });

    it('should return 500 Internal Server Error on unexpected failure', async () => {
        mockValidateApiKey.mockRejectedValue(new Error('Database connection failed'));

        const request = new NextRequest('https://minifyn.com/api/shorten', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer valid-token' },
            body: JSON.stringify({ url: 'https://example.com' }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body).toEqual({ error: 'Internal server error' });
    });
});
