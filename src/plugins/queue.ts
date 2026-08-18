import {Queue} from 'bullmq';
import fp from 'fastify-plugin';
import {QueueType} from '@/common/const';
import type {IEmailNotificationParams, IPushNotificationParams} from '@/common/notifications/types';

const queuePlugin = fp(
    async fastify => {
        const emailQueue = new Queue<IEmailNotificationParams>(QueueType.email, {connection: fastify.redisBullMq});
        const pushQueue = new Queue<IPushNotificationParams>(QueueType.push, {connection: fastify.redisBullMq});

        fastify.decorate('emailQueue', emailQueue);
        fastify.decorate('pushQueue', pushQueue);

        fastify.addHook('onClose', () => {
            emailQueue.close();
            pushQueue.close();
        });
    },
    {name: 'queue', dependencies: ['redis']}
);

export default queuePlugin;
