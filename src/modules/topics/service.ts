import type {Queue} from 'bullmq';
import type {IPushNotificationParams} from '@/common/notifications/types';
import type {IEntityListParams} from '@/common/types';
import type {PrismaClient, Topic} from '@/database/prisma/client';
import type {ICreateTopicData, ITopicListResponse, IUpdateTopicData} from './types';

class TopicsService {
    private readonly db: PrismaClient;
    private readonly pushQueue: Queue<IPushNotificationParams>;

    public constructor(db: PrismaClient, pushQueue: Queue<IPushNotificationParams>) {
        this.db = db;
        this.pushQueue = pushQueue;
    }

    public async createTopic(data: ICreateTopicData): Promise<Topic> {
        const topic = await this.db.topic.create({data});

        void this.pushQueue.add('topicCreated', {
            isOpenApp: true,
            message: 'New topic created',
            date: topic.createdAt
        });

        return topic;
    }

    public async getTopics({limit, page, search}: IEntityListParams): Promise<ITopicListResponse> {
        const searchedVal = {contains: search, mode: 'insensitive'} as const;
        const where = search ? {OR: [{name: searchedVal} as const, {description: searchedVal} as const]} : undefined;

        const [topics, total] = await this.db.$transaction([
            this.db.topic.findMany({
                take: limit,
                skip: (page - 1) * limit,
                where
            }),
            this.db.topic.count({where})
        ]);

        return {topics, total};
    }

    public getTopic(id: number): Promise<Topic> {
        return this.db.topic.findUniqueOrThrow({where: {id}});
    }

    public async updateTopic(id: number, data: IUpdateTopicData): Promise<Topic> {
        const topic = await this.db.topic.update({where: {id}, data});

        void this.pushQueue.add('topicUpdated', {
            isOpenApp: true,
            message: 'Topic updated',
            date: topic.updatedAt ?? new Date()
        });

        return topic;
    }

    public async deleteTopic(id: number): Promise<Topic> {
        const topic = await this.db.topic.delete({where: {id}});

        void this.pushQueue.add('topicDeleted', {
            isOpenApp: true,
            message: 'Topic deleted',
            date: new Date()
        });

        return topic;
    }
}

export default TopicsService;
