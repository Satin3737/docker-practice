import {fastifyRedis} from '@fastify/redis';
import fp from 'fastify-plugin';

const redisPlugin = fp(
    async fastify => {
        const url = fastify.config.REDIS_URL;

        await fastify.register(fastifyRedis, {
            url,
            namespace: 'rateLimit',
            maxRetriesPerRequest: 1,
            connectTimeout: 500
        });

        await fastify.register(fastifyRedis, {
            url,
            namespace: 'bullMq',
            maxRetriesPerRequest: null
        });

        fastify.decorate('redisRateLimit', fastify.redis.rateLimit);
        fastify.decorate('redisBullMq', fastify.redis.bullMq);
    },
    {name: 'redis', dependencies: ['env']}
);

export default redisPlugin;
