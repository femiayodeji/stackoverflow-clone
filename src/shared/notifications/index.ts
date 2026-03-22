import { NotificationService } from './NotificationService';
import { InAppChannel } from './channels/InAppChannel';
import { EmailChannel } from './channels/EmailChannel';
import { SSEChannel } from './channels/SSEChannel';

const channels = [new InAppChannel(), new EmailChannel(), new SSEChannel()];

export const notificationService = new NotificationService(channels);