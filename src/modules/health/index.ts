import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import Server from '@/server';

const health: FastifyPluginAsyncZod = async (fastify): Promise<void> => {
    fastify.get('/', async (_, res): Promise<void> => {
        Server.isShuttingDown ? void res.status(503).send({status: 'shutting down'}) : void res.send({status: 'ok'});
    });
};

export default health;
