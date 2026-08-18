import type {Queue} from 'bullmq';
import type Redis from 'ioredis';
import type EmailService from '@/common/notifications/email-service';
import type PushService from '@/common/notifications/push-service';
import type {IEmailNotificationParams, IPushNotificationParams} from '@/common/notifications/types';
import type {PrismaClient} from '@/database/prisma/client';
import type PostsService from '@/modules/posts/service';
import type TopicsService from '@/modules/topics/service';
import type {IEnvConfig} from '@/plugins/env';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
        postsService: PostsService;
        topicsService: TopicsService;
        emailService: EmailService;
        pushService: PushService;
        config: IEnvConfig;
        redisRateLimit: Redis;
        redisBullMq: Redis;
        emailQueue: Queue<IEmailNotificationParams>;
        pushQueue: Queue<IPushNotificationParams>;
    }
}
