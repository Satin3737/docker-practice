import {Worker} from 'bullmq';
import {QueueType} from '@/common/const';
import type {IPushNotificationParams} from '@/common/notifications/types';
import {workersContext} from '../context';

const {pushService, logger, redis: connection} = workersContext;

const worker = new Worker<IPushNotificationParams>(
    QueueType.push,
    async job => {
        void pushService.send(job.data);
    },
    {connection}
);

worker.on('failed', (_, err) => {
    logger.error(err, 'Failed to send push');
});

workersContext.listenShutdownProcessSignals(worker);
