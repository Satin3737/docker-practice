import {z} from 'zod';
import type {Post} from '@/database/prisma/client';
import {createPostSchema, updatePostSchema} from './schemas';

export type ICreatePostData = z.infer<typeof createPostSchema.body>;

export type IUpdatePostData = z.infer<typeof updatePostSchema.body>;

export interface IPostListResponse {
    posts: Post[];
    total: number;
}

interface IPostSearchRule {
    contains: string;
    mode: 'insensitive';
}

export interface IPostSearchWhere {
    OR: [{title: IPostSearchRule}, {content: IPostSearchRule}];
}
