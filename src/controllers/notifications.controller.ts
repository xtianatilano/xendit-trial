import { Request, Response } from 'express';

import { AbstractController } from '../abstract/abstract.controller';
import { notificationService } from '../services/notification.service';
import { notificationValidation } from '../validation/notification-validation';

export default class NotificationController extends AbstractController {
    public path = '/notifications';

    constructor() {
        super();
        this.initRoutes();
    }

    public initRoutes() {
        // endpoint for 3rd party provider to notify merchant
        this.router.post(this.path + '/:merchantId(\\d+)/notify', this.notify.bind(this));
        // endpoint to test merchant notification
        this.router.post(this.path + '/:merchantId(\\d+)/notify/test', this.notifyTest.bind(this));
        // endpoint to retry failed notifications
        this.router.post(this.path + '/:notificationId(\\d+)/retry', this.retry.bind(this));
    }

    /**
     *
     * @param req Request
     * @param res Response
     */
    public async notify (req: Request, res: Response): Promise<void> {
        let merchant;

        try {
            // validate first
            merchant = await notificationValidation.validateNotify(req);
        } catch (error) {
            this.fail(res, error)
        }

        if (!merchant) {
            return;
        }

        // fire and forget
        res.sendStatus(200);

        // will process notification background
        setTimeout(async () => {
            await notificationService.notify(req, merchant);
        }, 0);
    };

    /**
     * @param req Request
     * @param res Response
     */
    public async notifyTest (req: Request, res: Response): Promise<void> {
        let merchant;

        try {
            // validate first
            merchant = await notificationValidation.validateNotifyTest(req);
        } catch (error) {
            this.fail(res, error)
        }

        if (!merchant) {
            return;
        }

        // fire and forget
        res.sendStatus(200);

        // will process notification background
        setTimeout(async () => {
            await notificationService.notifyTest(req, merchant);
        }, 0);
    };

    /**
     * @param req Request
     * @param res Response
     */
    public async retry (req: Request, res: Response): Promise<void> {
        let notification;

        try {
            // validate first
            notification = await notificationValidation.validateRetry(req);
        } catch (error) {
            this.fail(res, error)
        }

        if (!notification) {
            return;
        }

        // fire and forget
        res.sendStatus(200);

        // will process notification background
        setTimeout(async () => {
            await notificationService.retry(notification);
        }, 0);
    };
}