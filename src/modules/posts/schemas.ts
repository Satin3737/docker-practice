import {z} from 'zod';
import {byIdPSchema, paginatedListSchema} from '@/common/schemas';
import {PostStatus} from '@/database/prisma/enums';
import {PostSchema} from '@/database/zod/schemas';

const postBodySchema = z.object({
    title: z.string().min(3).max(255),
    content: z.string().max(500),
    status: z.enum(PostStatus).default(PostStatus.draft)
});

const postListSchema = z.object({
    posts: z.array(PostSchema),
    total: z.number().int()
});

const topicPostParams = z.object({
    id: byIdPSchema.shape.id,
    postId: byIdPSchema.shape.id
});

export const getPostsSchema = {
    querystring: paginatedListSchema,
    response: {
        200: postListSchema
    }
};

export const getPostSchema = {
    params: byIdPSchema,
    response: {
        200: z.object({post: PostSchema})
    }
};

export const createPostSchema = {
    body: postBodySchema,
    response: {
        201: z.object({post: PostSchema})
    }
};

export const updatePostSchema = {
    params: byIdPSchema,
    body: postBodySchema.partial(),
    response: {
        200: z.object({post: PostSchema})
    }
};

export const deletePostSchema = {
    params: byIdPSchema,
    response: {
        200: z.object({post: PostSchema})
    }
};

export const getPostsByTopicSchema = {
    params: byIdPSchema,
    querystring: paginatedListSchema,
    response: {
        200: postListSchema
    }
};

export const assignPostSchema = {
    params: topicPostParams,
    response: {
        200: z.object({post: PostSchema})
    }
};

export const unassignPostSchema = {
    params: topicPostParams,
    response: {
        200: z.object({post: PostSchema})
    }
};
