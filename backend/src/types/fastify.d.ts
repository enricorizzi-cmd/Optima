import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { AuthUser } from './auth';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void | FastifyReply>;
  }

  interface FastifyRequest {
    user: AuthUser;
  }
}
