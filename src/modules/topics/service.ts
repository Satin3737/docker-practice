import type {IEntityListParams} from '@/common/types';
import type {PrismaClient, Topic} from '@/database/prisma/client';
import type {ICreateTopicData, ITopicListResponse, IUpdateTopicData} from './types';

class TopicsService {
    private readonly db: PrismaClient;

    public constructor(db: PrismaClient) {
        this.db = db;
    }

    public createTopic(data: ICreateTopicData): Promise<Topic> {
        return this.db.topic.create({data});
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

    public updateTopic(id: number, data: IUpdateTopicData): Promise<Topic> {
        return this.db.topic.update({where: {id}, data});
    }

    public deleteTopic(id: number): Promise<Topic> {
        return this.db.topic.delete({where: {id}});
    }
}

export default TopicsService;
