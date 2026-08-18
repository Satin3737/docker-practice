import fp from 'fastify-plugin';
import EmailService from '@/common/notifications/email-service';
import PushService from '@/common/notifications/push-service';
import PostsService from '@/modules/posts/service';
import TopicsService from '@/modules/topics/service';

const servicesPlugin = fp(
    async fastify => {
        fastify.decorate('emailService', new EmailService(fastify.log));
        fastify.decorate('pushService', new PushService(fastify.log));
        fastify.decorate('topicsService', new TopicsService(fastify.prisma));
        fastify.decorate('postsService', new PostsService(fastify.prisma));
    },
    {name: 'services', dependencies: ['queue', 'prisma']}
);

export default servicesPlugin;
