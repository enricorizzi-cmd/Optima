import fp from 'fastify-plugin';
import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { supabaseAdmin } from '../lib/supabase';
import type { AuthUser } from '../types/auth';
import { logger } from '../lib/logger';

const orgRoleSchema = z.enum(['owner', 'admin', 'editor', 'viewer']);

const userSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  app_metadata: z
    .object({
      role: orgRoleSchema.optional(),
    })
    .passthrough(),
  user_metadata: z
    .object({
      org_id: z.string().optional(),
      role: orgRoleSchema.optional(),
    })
    .passthrough(),
});

const uuidSchema = z.string().uuid();

async function resolveOrgId(userId: string, orgIdentifier?: string) {
  if (orgIdentifier && orgIdentifier.trim().length > 0) {
    const trimmed = orgIdentifier.trim();
    const uuidResult = uuidSchema.safeParse(trimmed);
    if (uuidResult.success) {
      return uuidResult.data;
    }

    const slugValue = trimmed.toLowerCase();
    const { data: orgBySlug, error: slugError } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('slug', slugValue)
      .maybeSingle();
    if (slugError) {
      logger.error({ error: slugError, slugValue }, 'Failed to resolve organization by slug');
    }
    if (orgBySlug?.id) {
      return orgBySlug.id;
    }

    const { data: orgByName, error: nameError } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('name', trimmed)
      .maybeSingle();
    if (nameError) {
      logger.error({ error: nameError, orgIdentifier: trimmed }, 'Failed to resolve organization by name');
    }
    if (orgByName?.id) {
      return orgByName.id;
    }
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('org_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (profileError) {
    logger.error({ error: profileError, userId }, 'Failed to resolve organization from profiles');
  }
  if (profile?.org_id) {
    return profile.org_id;
  }

  const { data: fallback, error: fallbackError } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (fallbackError) {
    logger.error({ error: fallbackError }, 'Failed to resolve fallback organization');
    return null;
  }

  if (fallback?.id) {
    logger.warn({ userId }, 'Falling back to first available organization for user');
    return fallback.id;
  }

  return null;
}

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

  const role = parsed.data.app_metadata.role ?? parsed.data.user_metadata.role ?? 'viewer';

  const orgId = await resolveOrgId(parsed.data.id, parsed.data.user_metadata.org_id);
  if (!orgId) {
    logger.error({ userId: parsed.data.id }, 'Unable to resolve organization for user');
    return reply.status(403).send({ message: 'Unauthorized organization' });
  }

  const user: AuthUser = {
    id: parsed.data.id,
    email: parsed.data.email ?? 'unknown@user.local',
    role,
    orgId,
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
