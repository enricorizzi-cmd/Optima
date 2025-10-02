import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { logger } from '../lib/logger';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  role: z.enum(['owner', 'admin', 'editor', 'viewer']).default('viewer'),
});

export async function registerAuthRoutes(app: FastifyInstance) {
  // Login endpoint
  app.post('/api/auth/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);
      
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      });

      if (error) {
        logger.warn({ error, email: body.email }, 'Login failed');
        return reply.code(401).send({ 
          message: 'Invalid credentials',
          error: error.message 
        });
      }

      logger.info({ userId: data.user?.id, email: body.email }).send('User logged in successfully');
      
      return {
        user: data.user,
        session: data.session,
        message: 'Login successful'
      };
    } catch (error) {
      logger.error({ error }, 'Login endpoint error');
      return reply.code(400).send({ 
        message: 'Invalid request',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Register endpoint
  app.post('/api/auth/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);
      
      const { data, error } = await supabaseAdmin.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: {
            full_name: body.fullName,
            role: body.role,
          }
        }
      });

      if (error) {
        logger.warn({ error, email: body.email }, 'Registration failed');
        return reply.code(400).send({ 
          message: 'Registration failed',
          error: error.message 
        });
      }

      logger.info({ userId: data.user?.id, email: body.email }, 'User registered successfully');
      
      return {
        user: data.user,
        message: 'Registration successful'
      };
    } catch (error) {
      logger.error({ error }, 'Registration endpoint error');
      return reply.code(400).send({ 
        message: 'Invalid request',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({ message: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return reply.code(401).send({ message: 'Invalid authorization header' });
    }

    const { error } = await supabaseAdmin.auth.signOut({
      scope: 'global'
    });

    if (error) {
      logger.warn({ error }, 'Logout failed');
      return reply.code(400).send({ 
        message: 'Logout failed',
        error: error.message 
      });
    }

    logger.info('User logged out successfully');
    
    return {
      message: 'Logout successful'
    };
  });

  // Health check for auth service
  app.get('/api/auth/health', async () => {
    return { 
      status: 'ok', 
      service: 'auth',
      timestamp: new Date().toISOString() 
    };
  });
}
