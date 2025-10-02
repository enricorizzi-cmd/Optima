import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { getEnv } from '../lib/env';

export default fp(async (fastify) => {
  const env = getEnv();

  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", env.SUPABASE_URL, 'https://api.render.com'],
        manifestSrc: ["'self'"],
        workerSrc: ["'self'", 'blob:'],
      },
    },
  });

  await fastify.register(cors, {
    origin: env.CORS_ORIGIN.split(','),
    credentials: true,
  });

  // Global rate limiting - more permissive for development
  await fastify.register(rateLimit, {
    max: 1000,
    timeWindow: '1 minute',
  });

  // Stricter rate limiting for sensitive operations - more permissive for development
  await fastify.register(async (scopedFastify) => {
    await scopedFastify.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute',
      keyGenerator: (request) => {
        const user = (request as any).user;
        return user ? `${user.id}-sensitive` : request.ip;
      },
    });
  }, { prefix: '/api/orders' });

  await fastify.register(async (scopedFastify) => {
    await scopedFastify.register(rateLimit, {
      max: 50,
      timeWindow: '1 minute',
      keyGenerator: (request) => {
        const user = (request as any).user;
        return user ? `${user.id}-production` : request.ip;
      },
    });
  }, { prefix: '/api/production' });
});
