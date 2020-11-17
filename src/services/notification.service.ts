import { Request } from 'express';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { generateSampleData } from '../util/notification-types';
import { AbstractService } from '../abstract/abstract.service';
import { notificationRepository } from '../repositories/notification-repository';
import { merchantRepository } from '../repositories/merchant-repository';
import { Merchant } from '../model/merchant';
import { Notification } from '../model/notification';

class NotificationService extends AbstractService {

    constructor() {
        super();
    }

    /**
     * service to notify notification url
     * @param req Request
     */
    async notify(req: Request, merchant: Merchant): Promise<any> {
        const notification = await notificationRepository.create({
            notificationUrl: merchant.notification_url,
            merchantId: merchant.id,
            notificationType: req.body.notification_type,
            notificationPayload: req.body.payload,
            idempotencyKey: req.headers['x-idempotency-key'] as string
        });

        try {
            const retries = 5;
            axiosRetry(axios, {
                retries: retries,
                retryDelay: (retryCount) => {
                    const retryDelay = retryCount * 3000;
                    console.log('retrying.. attempt ' + retryCount + ', with delay of ' + retryDelay + ' milliseconds');

                    if (retryCount === retries) {
                        console.log('Max retry attempts reached, contact merchant to escalate issue.');
                    }
                    return retryDelay;
                },
                retryCondition: (error) => {
                    if (error.response?.status === 500 || error.response?.status === 404) {
                        return true;
                    }
                    return false;
                },
            });

            const requestParameters = req.body.payload;
            const notifyUrl = await axios.post(
                notification.notification_url,
                requestParameters,
                {
                    headers: {
                        'X-Token': merchant.notification_key
                    }
                }
            );

            if (notifyUrl.status === 200) {
                notificationRepository.notificationSuccess(notification.id);
            }
        } catch (error) {

            if (notification !== undefined) {
                notificationRepository.notificationFailed(notification.id);
            }
        }
    };

    /**
     * service to test notification url
     * @param req Request
     */
    async notifyTest(req: Request, merchant: Merchant): Promise<void> {
        const notification = await notificationRepository.create({
            notificationUrl: merchant.notification_url,
            merchantId: merchant.id,
            notificationType: req.body.notification_type,
            notificationPayload: generateSampleData(req.body.notification_type),
        });

        try {
            const notifyUrl = await axios.post(
                notification.notification_url,
                notification.notification_payload,
                {
                    headers: {
                        'X-Token': merchant.notification_key
                    }
                }
            );

            if (notifyUrl.status === 200) {
                notificationRepository.notificationSuccess(notification.id);
            }
        } catch (error) {
            if (notification !== undefined) {
                notificationRepository.notificationFailed(notification.id);
            }
            this.logError(merchant, 'ERROR')
        }
    };

    async retry(notification: Notification): Promise<void> {
        const merchant = await merchantRepository.getMerchantById(notification.merchant_id);

        try {
            const retry = await axios.post(
                notification.notification_url,
                notification.notification_payload,
                {
                    headers: {
                        'X-Token': merchant.notification_key
                    }
                }
            );

            if (retry.status === 200) {
                notificationRepository.notificationSuccess(notification.id);
            }
        } catch (error) {
            notificationRepository.notificationFailed(notification.id);
            this.logError(notification, 'ERROR');
        }
    };
}

export const notificationService = new NotificationService();