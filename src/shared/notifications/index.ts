import { NotificationService } from './NotificationService';
import { InAppChannel } from './channels/InAppChannel';
import { EmailChannel } from './channels/EmailChannel';

const channels = [new InAppChannel(), new EmailChannel()];

export const notificationService = new NotificationService(channels);