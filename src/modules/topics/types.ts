import {z} from 'zod';
import type {Topic} from '@/database/prisma/client';
import {type createTopicSchema, updateTopicSchema} from './schemas';

export type ICreateTopicData = z.infer<typeof createTopicSchema.body>;

export type IUpdateTopicData = z.infer<typeof updateTopicSchema.body>;

export interface ITopicListResponse {
    topics: Topic[];
    total: number;
}
