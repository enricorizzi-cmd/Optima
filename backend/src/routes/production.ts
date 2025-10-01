import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import {
  customerOrderSchema,
  customerOrderInsertSchema,
  orderLineSchema,
  orderLineInsertSchema,
  productionScheduleSchema,
  productionScheduleInsertSchema,
  productionProgressSchema,
  productionProgressInsertSchema,
  deliverySchema,
  deliveryInsertSchema,
  productionStatusSchema,
  deliveryStatusSchema,
} from '../schemas/production';
import {
  listOrders,
  createCustomerOrder,
  updateOrderStatus,
  scheduleProduction,
  updateScheduleStatus,
  recordProductionProgress,
  recordDelivery,
  updateDeliveryStatus,
  listSchedules,
  listDeliveries,
} from '../services/productionService';

export async function registerProductionRoutes(app: FastifyInstance) {
  const orderWithLinesSchema = customerOrderInsertSchema.extend({
    lines: z.array(orderLineInsertSchema).min(1),
  });

  app.withTypeProvider<ZodTypeProvider>().register(async (fastify) => {
    fastify.addHook('preHandler', fastify.authenticate);

    fastify.get('/api/orders', {
      schema: {
        response: {
          200: z.array(customerOrderSchema.extend({
            lines: z.array(orderLineSchema).optional(),
          })),
        },
      },
    }, async (request) => {
      return listOrders(request.user.orgId);
    });

    fastify.get('/api/production/schedules', {
      schema: {
        response: { 200: z.array(productionScheduleSchema) },
      },
    }, async (request) => {
      return listSchedules(request.user.orgId);
    });

    fastify.get('/api/deliveries', {
      schema: {
        response: { 200: z.array(deliverySchema) },
      },
    }, async (request) => {
      return listDeliveries(request.user.orgId);
    });

    fastify.post('/api/orders', {
      schema: {
        body: orderWithLinesSchema.omit({ org_id: true }),
        response: { 201: customerOrderSchema },
      },
    }, async (request, reply) => {
      const created = await createCustomerOrder({ ...request.body, org_id: request.user.orgId });
      reply.code(201);
      return created;
    });

    fastify.patch('/api/orders/:id/status', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ status: z.union([productionStatusSchema, z.enum(['fulfilled', 'cancelled'])]) }),
        response: { 200: customerOrderSchema },
      },
    }, async (request) => {
      return updateOrderStatus(request.params.id, request.user.orgId, request.body.status);
    });

    fastify.post('/api/production/schedules', {
      schema: {
        body: productionScheduleInsertSchema.omit({ org_id: true }),
        response: { 201: productionScheduleSchema },
      },
    }, async (request, reply) => {
      const created = await scheduleProduction({ ...request.body, org_id: request.user.orgId });
      reply.code(201);
      return created;
    });

    fastify.patch('/api/production/schedules/:id/status', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ status: productionStatusSchema }),
        response: { 200: productionScheduleSchema },
      },
    }, async (request) => {
      return updateScheduleStatus(request.params.id, request.user.orgId, request.body.status);
    });

    fastify.post('/api/production/progress', {
      schema: {
        body: productionProgressInsertSchema.omit({ org_id: true }),
        response: { 201: productionProgressSchema },
      },
    }, async (request, reply) => {
      const created = await recordProductionProgress({ ...request.body, org_id: request.user.orgId });
      reply.code(201);
      return created;
    });

    fastify.post('/api/deliveries', {
      schema: {
        body: deliveryInsertSchema.omit({ org_id: true }),
        response: { 201: deliverySchema },
      },
    }, async (request, reply) => {
      const created = await recordDelivery({ ...request.body, org_id: request.user.orgId });
      reply.code(201);
      return created;
    });

    fastify.patch('/api/deliveries/:id/status', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ status: deliveryStatusSchema }),
        response: { 200: deliverySchema },
      },
    }, async (request) => {
      return updateDeliveryStatus(request.params.id, request.user.orgId, request.body.status);
    });
  });
}
