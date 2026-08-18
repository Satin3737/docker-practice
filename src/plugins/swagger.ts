import swagger from '@fastify/swagger';
import fp from 'fastify-plugin';
import {jsonSchemaTransform} from 'fastify-type-provider-zod';

const swaggerPlugin = fp(
    async fastify => {
        await fastify.register(swagger, {
            openapi: {
                info: {
                    title: 'Docker Practice API',
                    description: 'API documentation for Docker Practice',
                    version: '1.0.0'
                },
                tags: [
                    {name: 'Missions', description: 'Combat missions'},
                    {name: 'Weapons', description: 'Weapons arsenal'}
                ]
            },
            transform: jsonSchemaTransform
        });

        fastify.addHook('onRoute', routeOptions => {
            const segment = routeOptions.prefix.replace(/^\//, '');
            if (!segment) return;
            routeOptions.schema ??= {};
            routeOptions.schema.tags ??= [segment[0].toUpperCase() + segment.slice(1)];
        });
    },
    {name: 'swagger'}
);

export default swaggerPlugin;
