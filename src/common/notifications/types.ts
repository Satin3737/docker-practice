export interface INotificationParams {
    message: string;
    date: Date;
}

export interface IEmailNotificationParams extends INotificationParams {
    to: string;
}

export interface IPushNotificationParams extends INotificationParams {
    isOpenApp: boolean;
}
