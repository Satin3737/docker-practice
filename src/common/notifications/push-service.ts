import BaseNotification from './base-notification';
import type {IPushNotificationParams} from './types';

class PushService extends BaseNotification<IPushNotificationParams> {
    public send(params: IPushNotificationParams): void {
        this.logger.info(params, 'Push sent successfully');
    }
}

export default PushService;
