import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import {createPostSchema, deletePostSchema, getPostSchema, getPostsSchema, updatePostSchema} from './schemas';

const posts: FastifyPluginAsyncZod = async (fastify): Promise<void> => {
    const postsService = fastify.postsService;

    fastify.post('/', {schema: createPostSchema}, async (req, res): Promise<void> => {
        void res.status(201).send({post: await postsService.createPost(req.body)});
    });

    fastify.get('/', {schema: getPostsSchema}, async (req, res): Promise<void> => {
        void res.send(await postsService.getPosts(req.query));
    });

    fastify.get('/:id', {schema: getPostSchema}, async (req, res): Promise<void> => {
        void res.send({post: await postsService.getPost(req.params.id)});
    });

    fastify.patch('/:id', {schema: updatePostSchema}, async (req, res): Promise<void> => {
        void res.send({post: await postsService.updatePost(req.params.id, req.body)});
    });

    fastify.delete('/:id', {schema: deletePostSchema}, async (req, res): Promise<void> => {
        void res.send({post: await postsService.deletePost(req.params.id)});
    });
};

export default posts;
