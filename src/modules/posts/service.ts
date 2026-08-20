import type {Queue} from 'bullmq';
import type {IEmailNotificationParams} from '@/common/notifications/types';
import type {IEntityListParams} from '@/common/types';
import type {Post, PrismaClient} from '@/database/prisma/client';
import type {ICreatePostData, IPostListResponse, IPostSearchWhere, IUpdatePostData} from './types';

class PostsService {
    private readonly db: PrismaClient;
    private readonly emailQueue: Queue<IEmailNotificationParams>;

    public constructor(db: PrismaClient, emailQueue: Queue<IEmailNotificationParams>) {
        this.db = db;
        this.emailQueue = emailQueue;
    }

    public async createPost(data: ICreatePostData): Promise<Post> {
        const post = await this.db.post.create({data});

        void this.emailQueue.add('postCreated', {
            to: 'somebody',
            message: 'New post created',
            date: post.createdAt
        });

        return post;
    }

    public async getPosts({limit, page, search}: IEntityListParams): Promise<IPostListResponse> {
        const where = this.getPostSearchWhere(search);

        const [posts, total] = await this.db.$transaction([
            this.db.post.findMany({
                take: limit,
                skip: (page - 1) * limit,
                where
            }),
            this.db.post.count({where})
        ]);

        return {posts, total};
    }

    public getPost(id: number): Promise<Post> {
        return this.db.post.findUniqueOrThrow({where: {id}});
    }

    public async updatePost(id: number, data: IUpdatePostData): Promise<Post> {
        const post = await this.db.post.update({where: {id}, data});

        void this.emailQueue.add('postUpdated', {
            to: 'somebody',
            message: 'Post updated',
            date: post.updatedAt ?? new Date()
        });

        return post;
    }

    public async deletePost(id: number): Promise<Post> {
        const post = await this.db.post.delete({where: {id}});

        void this.emailQueue.add('postDeleted', {
            to: 'somebody',
            message: 'Post deleted',
            date: new Date()
        });

        return post;
    }

    public async getPostsByTopic(
        topicId: number,
        {limit, page, search}: IEntityListParams
    ): Promise<IPostListResponse> {
        const where = {topicId, ...this.getPostSearchWhere(search)};

        const [posts, total] = await this.db.$transaction([
            this.db.post.findMany({
                take: limit,
                skip: (page - 1) * limit,
                where
            }),
            this.db.post.count({where})
        ]);

        return {posts, total};
    }

    public assignPostToTopic(postId: number, topicId: number): Promise<Post> {
        return this.db.post.update({
            where: {id: postId},
            data: {topic: {connect: {id: topicId}}}
        });
    }

    public unassignPostFromTopic(postId: number, topicId: number): Promise<Post> {
        return this.db.post.update({
            where: {id: postId, topicId},
            data: {topic: {disconnect: true}}
        });
    }

    private getPostSearchWhere(search: string | undefined): IPostSearchWhere | undefined {
        if (!search) return;
        const searchedVal = {contains: search, mode: 'insensitive'} as const;
        return {OR: [{title: searchedVal}, {content: searchedVal}]};
    }
}

export default PostsService;
