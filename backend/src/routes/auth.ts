import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';

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
        return reply.code(401).send({ 
          message: 'Invalid credentials',
          error: error.message 
        });
      }

      return {
        user: data.user,
        session: data.session,
        message: 'Login successful'
      };
    } catch (error) {
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
        return reply.code(400).send({ 
          message: 'Registration failed',
          error: error.message 
        });
      }

      return {
        user: data.user,
        message: 'Registration successful'
      };
    } catch (error) {
      return reply.code(400).send({ 
        message: 'Invalid request',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
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