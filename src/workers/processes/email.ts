import {Worker} from 'bullmq';
import {QueueType} from '@/common/const';
import type {IEmailNotificationParams} from '@/common/notifications/types';
import {workersContext} from '../context';

const {emailService, logger, redis: connection} = workersContext;

const worker = new Worker<IEmailNotificationParams>(
    QueueType.email,
    async job => {
        void emailService.send(job.data);
    },
    {connection}
);

worker.on('failed', (_, err) => {
    logger.error(err, 'Failed to send email');
});

workersContext.listenShutdownProcessSignals(worker);
