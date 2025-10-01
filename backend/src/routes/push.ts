import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { pushSubscribeBodySchema, pushTestBodySchema } from '../schemas/push';
import { saveSubscription, sendTestNotification } from '../services/pushService';

export async function registerPushRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(async (fastify) => {
    fastify.addHook('preHandler', fastify.authenticate);

    fastify.post('/api/push/subscribe', {
      schema: {
        body: pushSubscribeBodySchema,
        response: { 201: z.object({ id: z.string(), endpoint: z.string().url() }) },
      },
    }, async (request, reply) => {
      const saved = await saveSubscription(request.user.orgId, request.user.id, request.body.subscription);
      reply.code(201);
      return { id: saved.id, endpoint: saved.endpoint };
    });

    fastify.post('/api/push/test', {
      schema: {
        body: pushTestBodySchema,
        response: { 202: z.object({ status: z.literal('queued') }) },
      },
    }, async (request, reply) => {
      await sendTestNotification(request.body.subscription_id, request.user.orgId, {
        title: request.body.title,
        body: request.body.body,
      });
      reply.code(202);
      return { status: 'queued' as const };
    });
  });
}
