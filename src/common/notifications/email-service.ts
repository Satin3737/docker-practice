import BaseNotification from './base-notification';
import type {IEmailNotificationParams} from './types';

class EmailService extends BaseNotification<IEmailNotificationParams> {
    public send(params: IEmailNotificationParams): void {
        this.logger.info(params, 'Email sent successfully');
    }
}

export default EmailService;
