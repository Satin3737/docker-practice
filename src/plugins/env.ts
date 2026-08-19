import env from '@fastify/env';
import fp from 'fastify-plugin';
import {z} from 'zod';
import {Environment} from '@/common/const';

const schema = z.object({
    PORT: z.number().default(3000),
    HOST: z.string().default('0.0.0.0'),
    NODE_ENV: z.enum(Environment).default(Environment.development),
    CORS_ORIGIN: z.string(),
    DATABASE_URL: z.string(),
    REDIS_URL: z.string()
});

export type IEnvConfig = z.infer<typeof schema>;

const envPlugin = fp(
    async fastify => {
        const {$schema, ...jsonSchema} = z.toJSONSchema(schema);
        await fastify.register(env, {schema: jsonSchema});
    },
    {name: 'env'}
);

export default envPlugin;
