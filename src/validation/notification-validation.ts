import { Request } from 'express';
import { ErrorHandler } from '../util/error-handler';
import { NOTIFICATION_TYPES } from '../util/notification-types';
import { AbstractService } from '../abstract/abstract.service';
import { notificationRepository } from '../repositories/notification-repository';
import { merchantRepository } from '../repositories/merchant-repository';

class NotificationValidation extends AbstractService {

    constructor() {
        super();
    }

    async validateNotify(req: Request) {
        try {
            if (req.body.payload === undefined || req.body.notification_type === undefined) {
                throw new ErrorHandler(400, 'BAD_REQUEST', 'Invalid Request Parameters');
            }

            const idempotencyKey = req.headers['x-idempotency-key'];
            if (idempotencyKey === undefined) {
                throw new ErrorHandler(400, 'BAD_REQUEST', 'Missing X-Idempotency-Key header.');
            }

            const notification = await notificationRepository.getNotificationByIdempotencyKey(idempotencyKey);

            if (notification.length > 0) {
                throw new ErrorHandler(400, 'NOTIFICATION_INVALID', 'Idempotency Key already exists.');
            }

            const merchant = await merchantRepository.getMerchantById(req.params.merchantId);

            if (!merchant.notification_url) {
                throw new ErrorHandler(400, 'NOTIFICATION_URL_NOT_SET', 'Notification URL not set.');
            }

            return merchant
        } catch (error) {
            throw error;
        }
    };

    async validateNotifyTest(req: Request) {
        try {
            if (
                req.body.notification_type === undefined || !NOTIFICATION_TYPES.includes(req.body.notification_type)
            ) {
                throw new ErrorHandler(400, 'BAD_REQUEST', 'Invalid Request Parameters');
            }

            const merchant = await merchantRepository.getMerchantById(req.params.merchantId);

            if (!merchant.notification_url) {
                throw new ErrorHandler(400, 'NOTIFICATION_URL_NOT_SET', 'Notification URL not set.');
            }

            return merchant;
        } catch (error) {
            throw error;
        }
    };

    async validateRetry(req: Request) {
        try {
            const notification = await notificationRepository.getNotificationById(req.params.notificationId);

            if (notification.status !== 'failed') {
                throw new ErrorHandler(400, 'NOTIFICATION_RETRY_INVALID', 'Notification is not valid for retry.');
            }

            if (req.body.notification_type !== undefined && !NOTIFICATION_TYPES.includes(req.body.notification_type)) {
                throw new ErrorHandler(400, 'BAD_REQUEST', 'Invalid Request Parameters');
            }

            return notification;
        } catch (error) {
            throw error;
        }
    }
}

export const notificationValidation = new NotificationValidation();