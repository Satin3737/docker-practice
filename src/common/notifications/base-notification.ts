import type {FastifyBaseLogger} from 'fastify';
import type {INotificationParams} from './types';

abstract class BaseNotification<TParams extends INotificationParams> {
    protected readonly logger: FastifyBaseLogger;

    public constructor(logger: FastifyBaseLogger) {
        this.logger = logger;
    }

    public abstract send(params: TParams): void;
}

export default BaseNotification;
