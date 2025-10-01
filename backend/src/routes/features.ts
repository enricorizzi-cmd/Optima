import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { featureSchema } from '../schemas/features';
import { listOrgFeatures } from '../services/featuresService';

export async function registerFeatureRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(async (fastify) => {
    fastify.addHook('preHandler', fastify.authenticate);

    fastify.get('/api/features', {
      schema: {
        response: { 200: z.array(featureSchema) },
      },
    }, async (request) => {
      return listOrgFeatures(request.user.orgId);
    });
  });
}
