import fp from 'fastify-plugin';
import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { supabaseAdmin } from '../lib/supabase';
import type { AuthUser } from '../types/auth';
import { logger } from '../lib/logger';

const userSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  app_metadata: z
    .object({
      role: z.enum(['owner', 'admin', 'editor', 'viewer']).default('viewer'),
    })
    .passthrough(),
  user_metadata: z
    .object({
      org_id: z.string(),
    })
    .passthrough(),
});

async function verifyRequest(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return reply.status(401).send({ message: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return reply.status(401).send({ message: 'Invalid authorization header' });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    logger.warn({ error }, 'Supabase auth getUser failed');
    return reply.status(401).send({ message: 'Invalid token' });
  }

  const parsed = userSchema.safeParse(data.user);
  if (!parsed.success) {
    logger.error({ issues: parsed.error.issues }, 'Unexpected Supabase user payload');
    return reply.status(403).send({ message: 'Unauthorized' });
  }

  const user: AuthUser = {
    id: parsed.data.id,
    email: parsed.data.email ?? 'unknown@user.local',
    role: parsed.data.app_metadata.role,
    orgId: parsed.data.user_metadata.org_id,
  };

  request.user = user;
}

export default fp(async (fastify) => {
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    const result = await verifyRequest(request, reply);
    if (result) {
      return result;
    }
  });
});
