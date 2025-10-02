import 'dotenv/config';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import authPlugin from './middleware/auth';
import securityPlugin from './middleware/security';
import { registerCatalogRoutes } from './routes/catalog';
import { registerProductionRoutes } from './routes/production';
import { registerPushRoutes } from './routes/push';
import { registerFeatureRoutes } from './routes/features';
import { registerHealthRoutes } from './routes/health';
import { logger } from './lib/logger';
import { getEnv } from './lib/env';

async function buildServer() {
  const app = Fastify({
    logger,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(securityPlugin);
  await app.register(registerHealthRoutes);
  await app.register(authPlugin);
  await app.register(registerCatalogRoutes);
  await app.register(registerProductionRoutes);
  await app.register(registerPushRoutes);
  await app.register(registerFeatureRoutes);

  return app;
}

async function start() {
  const env = getEnv();
  const app = await buildServer();

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info({ port: env.PORT }, 'Backend server ready');
  } catch (error) {
    app.log.error(error, 'Failed to start server');
    process.exit(1);
  }
}

// Start the server when this file is run directly
if (typeof require !== 'undefined' && require.main === module) {
  start();
}

export { buildServer };
