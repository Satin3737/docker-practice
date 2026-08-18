import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import {assignPostSchema, getPostsByTopicSchema, unassignPostSchema} from '@/modules/posts/schemas';
import {createTopicSchema, deleteTopicSchema, getTopicSchema, getTopicsSchema, updateTopicSchema} from './schemas';

const topics: FastifyPluginAsyncZod = async (fastify): Promise<void> => {
    const topicsService = fastify.topicsService;
    const postsService = fastify.postsService;

    fastify.post('/', {schema: createTopicSchema}, async (req, res): Promise<void> => {
        void res.status(201).send({topic: await topicsService.createTopic(req.body)});
    });

    fastify.get('/', {schema: getTopicsSchema}, async (req, res): Promise<void> => {
        void res.send(await topicsService.getTopics(req.query));
    });

    fastify.get('/:id', {schema: getTopicSchema}, async (req, res): Promise<void> => {
        void res.send({topic: await topicsService.getTopic(req.params.id)});
    });

    fastify.patch('/:id', {schema: updateTopicSchema}, async (req, res): Promise<void> => {
        void res.send({topic: await topicsService.updateTopic(req.params.id, req.body)});
    });

    fastify.delete('/:id', {schema: deleteTopicSchema}, async (req, res): Promise<void> => {
        void res.send({topic: await topicsService.deleteTopic(req.params.id)});
    });

    fastify.get('/:id/posts', {schema: getPostsByTopicSchema}, async (req, res): Promise<void> => {
        void res.send(await postsService.getPostsByTopic(req.params.id, req.query));
    });

    fastify.put('/:id/posts/:postId', {schema: assignPostSchema}, async (req, res): Promise<void> => {
        void res.send({post: await postsService.assignPostToTopic(req.params.postId, req.params.id)});
    });

    fastify.delete('/:id/posts/:postId', {schema: unassignPostSchema}, async (req, res): Promise<void> => {
        void res.send({post: await postsService.unassignPostFromTopic(req.params.postId, req.params.id)});
    });
};

export default topics;
