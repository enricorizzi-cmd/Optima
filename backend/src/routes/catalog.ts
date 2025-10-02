import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import {
  clientSchema,
  clientInsertSchema,
  supplierSchema,
  supplierInsertSchema,
  rawMaterialSchema,
  rawMaterialInsertSchema,
  finishedProductSchema,
  finishedProductInsertSchema,
  warehouseSchema,
  warehouseInsertSchema,
  operatorSchema,
  operatorInsertSchema,
  inventoryItemSchema,
  inventoryUpsertSchema,
} from '../schemas/catalog';
import {
  insertClient,
  updateClient,
  insertSupplier,
  updateSupplier,
  insertRawMaterial,
  updateRawMaterial,
  insertFinishedProduct,
  updateFinishedProduct,
  insertWarehouse,
  updateWarehouse,
  insertOperator,
  updateOperator,
  upsertInventory,
  listByOrg,
  deleteById,
} from '../services/catalogService';
import { supabaseAdmin } from '../lib/supabase';

export async function registerCatalogRoutes(app: FastifyInstance) {
  type Client = z.infer<typeof clientSchema>;
  type Supplier = z.infer<typeof supplierSchema>;
  type RawMaterial = z.infer<typeof rawMaterialSchema>;
  type FinishedProduct = z.infer<typeof finishedProductSchema>;
  type Warehouse = z.infer<typeof warehouseSchema>;
  type Operator = z.infer<typeof operatorSchema>;
  type InventoryItem = z.infer<typeof inventoryItemSchema>;

  app.withTypeProvider<ZodTypeProvider>().register(async (fastify) => {
    fastify.addHook('preHandler', fastify.authenticate);

    fastify.get('/api/catalog/clients', {
      schema: {
        querystring: z.object({
          page: z.coerce.number().int().positive().default(1),
          limit: z.coerce.number().int().positive().max(100).default(50),
        }),
        response: {
          200: z.object({
            data: z.array(clientSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    }, async (request) => {
      const { page, limit } = request.query;
      const result = await listByOrg<Client>('clients', request.user.orgId, page, limit);
      return result;
    });

    fastify.post('/api/catalog/clients', {
      schema: {
        body: clientInsertSchema.omit({ org_id: true }),
        response: {
          201: clientSchema,
        },
      },
    }, async (request, reply) => {
      const payload = { ...request.body, org_id: request.user.orgId };
      const client = await insertClient(payload);
      reply.code(201);
      return client;
    });

    fastify.put('/api/catalog/clients/:id', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: clientInsertSchema.omit({ org_id: true }).partial(),
        response: {
          200: clientSchema,
        },
      },
    }, async (request) => {
      const { id } = request.params;
      const updated = await updateClient(id, request.user.orgId, request.body);
      return updated;
    });

    fastify.delete('/api/catalog/clients/:id', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: {
          204: z.null(),
        },
      },
    }, async (request, reply) => {
      const { id } = request.params;
      await deleteById('clients', id, request.user.orgId);
      reply.code(204);
      return null;
    });

    fastify.get('/api/catalog/suppliers', {
      schema: {
        querystring: z.object({
          page: z.coerce.number().int().positive().default(1),
          limit: z.coerce.number().int().positive().max(100).default(50),
        }),
        response: {
          200: z.object({
            data: z.array(supplierSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    }, async (request) => {
      const { page, limit } = request.query;
      return listByOrg<Supplier>('suppliers', request.user.orgId, page, limit);
    });

    fastify.post('/api/catalog/suppliers', {
      schema: {
        body: supplierInsertSchema.omit({ org_id: true }),
        response: { 201: supplierSchema },
      },
    }, async (request, reply) => {
      const supplier = await insertSupplier({ ...request.body, org_id: request.user.orgId });
      reply.code(201);
      return supplier;
    });

    fastify.put('/api/catalog/suppliers/:id', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: supplierInsertSchema.omit({ org_id: true }).partial(),
        response: { 200: supplierSchema },
      },
    }, async (request) => {
      return updateSupplier((request.params as any).id, request.user.orgId, request.body);
    });

    fastify.delete('/api/catalog/suppliers/:id', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
      },
    }, async (request, reply) => {
      await deleteById('suppliers', (request.params as any).id, request.user.orgId);
      reply.code(204);
      return null;
    });

    fastify.get('/api/catalog/raw-materials', {
      schema: {
        querystring: z.object({
          page: z.coerce.number().int().positive().default(1),
          limit: z.coerce.number().int().positive().max(100).default(50),
        }),
        response: {
          200: z.object({
            data: z.array(rawMaterialSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    }, async (request) => {
      const { page, limit } = request.query;
      return listByOrg<RawMaterial>('raw_materials', request.user.orgId, page, limit);
    });

    fastify.post('/api/catalog/raw-materials', {
      schema: {
        body: rawMaterialInsertSchema.omit({ org_id: true }),
        response: { 201: rawMaterialSchema },
      },
    }, async (request, reply) => {
      const material = await insertRawMaterial({ ...request.body, org_id: request.user.orgId });
      reply.code(201);
      return material;
    });

    fastify.put('/api/catalog/raw-materials/:id', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: rawMaterialInsertSchema.omit({ org_id: true }).partial(),
        response: { 200: rawMaterialSchema },
      },
    }, async (request) => {
      return updateRawMaterial((request.params as any).id, request.user.orgId, request.body);
    });

    fastify.get('/api/catalog/finished-products', {
      schema: {
        querystring: z.object({
          page: z.coerce.number().int().positive().default(1),
          limit: z.coerce.number().int().positive().max(100).default(50),
        }),
        response: {
          200: z.object({
            data: z.array(finishedProductSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    }, async (request) => {
      const { page, limit } = request.query;
      return listByOrg<FinishedProduct>('finished_products', request.user.orgId, page, limit);
    });

    fastify.post('/api/catalog/finished-products', {
      schema: {
        body: finishedProductInsertSchema.omit({ org_id: true }),
        response: { 201: finishedProductSchema },
      },
    }, async (request, reply) => {
      const product = await insertFinishedProduct({ ...request.body, org_id: request.user.orgId });
      reply.code(201);
      return product;
    });

    fastify.put('/api/catalog/finished-products/:id', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: finishedProductInsertSchema.omit({ org_id: true }).partial(),
        response: { 200: finishedProductSchema },
      },
    }, async (request) => {
      return updateFinishedProduct((request.params as any).id, request.user.orgId, request.body);
    });

    fastify.get('/api/catalog/warehouses', {
      schema: {
        querystring: z.object({
          page: z.coerce.number().int().positive().default(1),
          limit: z.coerce.number().int().positive().max(100).default(50),
        }),
        response: {
          200: z.object({
            data: z.array(warehouseSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    }, async (request) => {
      const { page, limit } = request.query;
      return listByOrg<Warehouse>('warehouses', request.user.orgId, page, limit);
    });

    fastify.post('/api/catalog/warehouses', {
      schema: {
        body: warehouseInsertSchema.omit({ org_id: true }),
        response: { 201: warehouseSchema },
      },
    }, async (request, reply) => {
      const warehouse = await insertWarehouse({ ...request.body, org_id: request.user.orgId });
      reply.code(201);
      return warehouse;
    });

    fastify.put('/api/catalog/warehouses/:id', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: warehouseInsertSchema.omit({ org_id: true }).partial(),
        response: { 200: warehouseSchema },
      },
    }, async (request) => {
      return updateWarehouse((request.params as any).id, request.user.orgId, request.body);
    });

    fastify.get('/api/catalog/operators', {
      schema: {
        querystring: z.object({
          page: z.coerce.number().int().positive().default(1),
          limit: z.coerce.number().int().positive().max(100).default(50),
        }),
        response: {
          200: z.object({
            data: z.array(operatorSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    }, async (request) => {
      const { page, limit } = request.query;
      return listByOrg<Operator>('operators', request.user.orgId, page, limit);
    });

    fastify.post('/api/catalog/operators', {
      schema: {
        body: operatorInsertSchema.omit({ org_id: true }),
        response: { 201: operatorSchema },
      },
    }, async (request, reply) => {
      const operator = await insertOperator({ ...request.body, org_id: request.user.orgId });
      reply.code(201);
      return operator;
    });

    fastify.put('/api/catalog/operators/:id', {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: operatorInsertSchema.omit({ org_id: true }).partial(),
        response: { 200: operatorSchema },
      },
    }, async (request) => {
      return updateOperator((request.params as any).id, request.user.orgId, request.body);
    });

    fastify.put('/api/catalog/inventory', {
      schema: {
        body: inventoryUpsertSchema.omit({ org_id: true }),
        response: { 200: inventoryItemSchema },
      },
    }, async (request) => {
      return upsertInventory({ ...request.body, org_id: request.user.orgId });
    });

    fastify.get('/api/catalog/inventory', {
      schema: {
        querystring: z.object({ type: z.enum(['raw_material', 'finished_product']).optional() }),
        response: { 200: z.array(inventoryItemSchema) },
      },
    }, async (request) => {
      const query = supabaseAdmin
        .from<InventoryItem>('inventory_items')
        .select('*')
        .eq('org_id', request.user.orgId)
        .order('updated_at', { ascending: false });
      if (request.query.type) {
        query.eq('item_type', request.query.type);
      }
      const { data, error } = await query;
      if (error) {
        throw error;
      }
      return data;
    });
  });
}
