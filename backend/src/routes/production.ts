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

  const idParamSchema = z.object({ id: z.string().uuid() });
  type IdParams = z.infer<typeof idParamSchema>;

  const orderStatusBodySchema = z.object({
    status: z.union([productionStatusSchema, z.enum(['fulfilled', 'cancelled'])]),
  });
  type OrderStatusBody = z.infer<typeof orderStatusBodySchema>;

  const scheduleStatusBodySchema = z.object({ status: productionStatusSchema });
  type ScheduleStatusBody = z.infer<typeof scheduleStatusBodySchema>;

  const deliveryStatusBodySchema = z.object({ status: deliveryStatusSchema });
  type DeliveryStatusBody = z.infer<typeof deliveryStatusBodySchema>;

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
      const body = request.body as Record<string, unknown>;
      const created = await createCustomerOrder({ ...body, org_id: request.user.orgId });
      reply.code(201);
      return created;
    });

    fastify.patch('/api/orders/:id/status', {
      schema: {
        params: idParamSchema,
        body: orderStatusBodySchema,
        response: { 200: customerOrderSchema },
      },
    }, async (request) => {
      const { id } = request.params as IdParams;
      const { status } = request.body as OrderStatusBody;
      return updateOrderStatus(id, request.user.orgId, status);
    });

    fastify.post('/api/production/schedules', {
      schema: {
        body: productionScheduleInsertSchema.omit({ org_id: true }),
        response: { 201: productionScheduleSchema },
      },
    }, async (request, reply) => {
      const body = request.body as Record<string, unknown>;
      const created = await scheduleProduction({ ...body, org_id: request.user.orgId });
      reply.code(201);
      return created;
    });

    fastify.patch('/api/production/schedules/:id/status', {
      schema: {
        params: idParamSchema,
        body: scheduleStatusBodySchema,
        response: { 200: productionScheduleSchema },
      },
    }, async (request) => {
      const { id } = request.params as IdParams;
      const { status } = request.body as ScheduleStatusBody;
      return updateScheduleStatus(id, request.user.orgId, status);
    });

    fastify.post('/api/production/progress', {
      schema: {
        body: productionProgressInsertSchema.omit({ org_id: true }),
        response: { 201: productionProgressSchema },
      },
    }, async (request, reply) => {
      const body = request.body as Record<string, unknown>;
      const created = await recordProductionProgress({ ...body, org_id: request.user.orgId });
      reply.code(201);
      return created;
    });

    fastify.post('/api/deliveries', {
      schema: {
        body: deliveryInsertSchema.omit({ org_id: true }),
        response: { 201: deliverySchema },
      },
    }, async (request, reply) => {
      const body = request.body as Record<string, unknown>;
      const created = await recordDelivery({ ...body, org_id: request.user.orgId });
      reply.code(201);
      return created;
    });

    fastify.patch('/api/deliveries/:id/status', {
      schema: {
        params: idParamSchema,
        body: deliveryStatusBodySchema,
        response: { 200: deliverySchema },
      },
    }, async (request) => {
      const { id } = request.params as IdParams;
      const { status } = request.body as DeliveryStatusBody;
      return updateDeliveryStatus(id, request.user.orgId, status);
    });
  });
}
