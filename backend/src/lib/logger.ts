import pino from 'pino';

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const logger = pino({
  level: nodeEnv === 'development' ? 'debug' : 'info',
  transport:
    nodeEnv === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'SYS:standard',
            singleLine: false,
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});
