import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify from 'fastify';
import { prismaClient } from '../utils/prisma';
import { flagsRoutes } from '../routes/flags';

let app: ReturnType<typeof Fastify>;

describe('Flags routes', () => {
  beforeAll(async () => {
    app = Fastify();
    await flagsRoutes(app);
    await app.ready();
  });

  beforeEach(async () => {
    // clean slate before each test
    await prismaClient.flag.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  });

  it('GET /flags returns an empty array when no flags exist', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/flags',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });

  it('POST /flags with minimal payload creates a new flag with correct defaults', async () => {
    const payload = { key: 'test-flag' };
    const res = await app.inject({
      method: 'POST',
      url: '/flags',
      payload,
    });

    expect(res.statusCode).toBe(201);

    const body = res.json();
    expect(body).toMatchObject({
      id: expect.any(Number),
      key: 'test-flag',
      type: 'percentage',      // default
      percentage: 0,           // default
      isActive: true,          // default
    });
    expect(new Date(body.createdAt)).toBeInstanceOf(Date);
    expect(new Date(body.updatedAt)).toBeInstanceOf(Date);
  });

  it('POST /flags rejects an empty key', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/flags',
      payload: { key: '' },  // invalid
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toHaveProperty('message');
  });

  it('POST /flags rejects out-of-range percentage', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/flags',
      payload: {
        key: 'foo',
        percentage: 150,      // invalid
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toHaveProperty('message');
  });
});
