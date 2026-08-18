import {z} from 'zod';
import {byIdPSchema, paginatedListSchema} from '@/common/schemas';
import {TopicSchema} from '@/database/zod/schemas';

const topicBodySchema = z.object({
    name: z.string().min(3).max(255),
    description: z.string().max(500).nullable().optional()
});

export const getTopicsSchema = {
    querystring: paginatedListSchema,
    response: {
        200: z.object({
            topics: z.array(TopicSchema),
            total: z.number().int()
        })
    }
};

export const getTopicSchema = {
    params: byIdPSchema,
    response: {
        200: z.object({topic: TopicSchema})
    }
};

export const createTopicSchema = {
    body: topicBodySchema,
    response: {
        201: z.object({topic: TopicSchema})
    }
};

export const updateTopicSchema = {
    params: byIdPSchema,
    body: topicBodySchema.partial(),
    response: {
        200: z.object({topic: TopicSchema})
    }
};

export const deleteTopicSchema = {
    params: byIdPSchema,
    response: {
        200: z.object({topic: TopicSchema})
    }
};
