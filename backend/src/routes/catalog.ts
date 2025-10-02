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

  const paginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
  });
  type PaginationQuery = z.infer<typeof paginationQuerySchema>;

  const idParamSchema = z.object({ id: z.string().uuid() });
  type IdParams = z.infer<typeof idParamSchema>;

  const inventoryFilterSchema = z.object({
    type: z.enum(['raw_material', 'finished_product']).optional(),
  });
  type InventoryFilterQuery = z.infer<typeof inventoryFilterSchema>;

  app.withTypeProvider<ZodTypeProvider>().register(async (fastify) => {
    fastify.addHook('preHandler', fastify.authenticate);

    fastify.get('/api/catalog/clients', {
      schema: {
        querystring: paginationQuerySchema,
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
      const { page, limit } = request.query as PaginationQuery;
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
      const body = request.body as Record<string, unknown>;
      const payload = { ...body, org_id: request.user.orgId };
      const client = await insertClient(payload);
      reply.code(201);
      return client;
    });

    fastify.put('/api/catalog/clients/:id', {
      schema: {
        params: idParamSchema,
        body: clientInsertSchema.omit({ org_id: true }).partial(),
        response: {
          200: clientSchema,
        },
      },
    }, async (request) => {
      const { id } = request.params as IdParams;
      const updated = await updateClient(id, request.user.orgId, request.body);
      return updated;
    });

    fastify.delete('/api/catalog/clients/:id', {
      schema: {
        params: idParamSchema,
        response: {
          204: z.null(),
        },
      },
    }, async (request, reply) => {
      const { id } = request.params as IdParams;
      await deleteById('clients', id, request.user.orgId);
      reply.code(204);
      return null;
    });

    fastify.get('/api/catalog/suppliers', {
      schema: {
        querystring: paginationQuerySchema,
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
      const { page, limit } = request.query as PaginationQuery;
      return listByOrg<Supplier>('suppliers', request.user.orgId, page, limit);
    });

    fastify.post('/api/catalog/suppliers', {
      schema: {
        body: supplierInsertSchema.omit({ org_id: true }),
        response: { 201: supplierSchema },
      },
    }, async (request, reply) => {
      const body = request.body as Record<string, unknown>;
      const supplier = await insertSupplier({ ...body, org_id: request.user.orgId });
      reply.code(201);
      return supplier;
    });

    fastify.put('/api/catalog/suppliers/:id', {
      schema: {
        params: idParamSchema,
        body: supplierInsertSchema.omit({ org_id: true }).partial(),
        response: { 200: supplierSchema },
      },
    }, async (request) => {
      const { id } = request.params as IdParams;
      return updateSupplier(id, request.user.orgId, request.body);
    });

    fastify.delete('/api/catalog/suppliers/:id', {
      schema: {
        params: idParamSchema,
        response: { 204: z.null() },
      },
    }, async (request, reply) => {
      const { id } = request.params as IdParams;
      await deleteById('suppliers', id, request.user.orgId);
      reply.code(204);
      return null;
    });

    fastify.get('/api/catalog/raw-materials', {
      schema: {
        querystring: paginationQuerySchema,
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
      const { page, limit } = request.query as PaginationQuery;
      return listByOrg<RawMaterial>('raw_materials', request.user.orgId, page, limit);
    });

    fastify.post('/api/catalog/raw-materials', {
      schema: {
        body: rawMaterialInsertSchema.omit({ org_id: true }),
        response: { 201: rawMaterialSchema },
      },
    }, async (request, reply) => {
      const body = request.body as Record<string, unknown>;
      const material = await insertRawMaterial({ ...body, org_id: request.user.orgId });
      reply.code(201);
      return material;
    });

    fastify.put('/api/catalog/raw-materials/:id', {
      schema: {
        params: idParamSchema,
        body: rawMaterialInsertSchema.omit({ org_id: true }).partial(),
        response: { 200: rawMaterialSchema },
      },
    }, async (request) => {
      const { id } = request.params as IdParams;
      return updateRawMaterial(id, request.user.orgId, request.body);
    });

    fastify.get('/api/catalog/finished-products', {
      schema: {
        querystring: paginationQuerySchema,
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
      const { page, limit } = request.query as PaginationQuery;
      return listByOrg<FinishedProduct>('finished_products', request.user.orgId, page, limit);
    });

    fastify.post('/api/catalog/finished-products', {
      schema: {
        body: finishedProductInsertSchema.omit({ org_id: true }),
        response: { 201: finishedProductSchema },
      },
    }, async (request, reply) => {
      const body = request.body as Record<string, unknown>;
      const product = await insertFinishedProduct({ ...body, org_id: request.user.orgId });
      reply.code(201);
      return product;
    });

    fastify.put('/api/catalog/finished-products/:id', {
      schema: {
        params: idParamSchema,
        body: finishedProductInsertSchema.omit({ org_id: true }).partial(),
        response: { 200: finishedProductSchema },
      },
    }, async (request) => {
      const { id } = request.params as IdParams;
      return updateFinishedProduct(id, request.user.orgId, request.body);
    });

    fastify.get('/api/catalog/warehouses', {
      schema: {
        querystring: paginationQuerySchema,
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
      const { page, limit } = request.query as PaginationQuery;
      return listByOrg<Warehouse>('warehouses', request.user.orgId, page, limit);
    });

    fastify.post('/api/catalog/warehouses', {
      schema: {
        body: warehouseInsertSchema.omit({ org_id: true }),
        response: { 201: warehouseSchema },
      },
    }, async (request, reply) => {
      const body = request.body as Record<string, unknown>;
      const warehouse = await insertWarehouse({ ...body, org_id: request.user.orgId });
      reply.code(201);
      return warehouse;
    });

    fastify.put('/api/catalog/warehouses/:id', {
      schema: {
        params: idParamSchema,
        body: warehouseInsertSchema.omit({ org_id: true }).partial(),
        response: { 200: warehouseSchema },
      },
    }, async (request) => {
      const { id } = request.params as IdParams;
      return updateWarehouse(id, request.user.orgId, request.body);
    });

    fastify.get('/api/catalog/operators', {
      schema: {
        querystring: paginationQuerySchema,
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
      const { page, limit } = request.query as PaginationQuery;
      return listByOrg<Operator>('operators', request.user.orgId, page, limit);
    });

    fastify.post('/api/catalog/operators', {
      schema: {
        body: operatorInsertSchema.omit({ org_id: true }),
        response: { 201: operatorSchema },
      },
    }, async (request, reply) => {
      const body = request.body as Record<string, unknown>;
      const operator = await insertOperator({ ...body, org_id: request.user.orgId });
      reply.code(201);
      return operator;
    });

    fastify.put('/api/catalog/operators/:id', {
      schema: {
        params: idParamSchema,
        body: operatorInsertSchema.omit({ org_id: true }).partial(),
        response: { 200: operatorSchema },
      },
    }, async (request) => {
      const { id } = request.params as IdParams;
      return updateOperator(id, request.user.orgId, request.body);
    });

    fastify.put('/api/catalog/inventory', {
      schema: {
        body: inventoryUpsertSchema.omit({ org_id: true }),
        response: { 200: inventoryItemSchema },
      },
    }, async (request) => {
      const body = request.body as Record<string, unknown>;
      return upsertInventory({ ...body, org_id: request.user.orgId });
    });

    fastify.get('/api/catalog/inventory', {
      schema: {
        querystring: inventoryFilterSchema,
        response: { 200: z.array(inventoryItemSchema) },
      },
    }, async (request) => {
      const { type } = request.query as InventoryFilterQuery;
      const query = supabaseAdmin
        .from('inventory_items')
        .select('*')
        .eq('org_id', request.user.orgId)
        .order('updated_at', { ascending: false });
      if (type) {
        query.eq('item_type', type);
      }
      const { data, error } = await query;
      if (error) {
        throw error;
      }
      return (data ?? []) as InventoryItem[];
    });
  });
}
