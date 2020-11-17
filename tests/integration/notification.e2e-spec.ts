import request from 'supertest';
import { pool } from '../../src/database';

const url = 'http://localhost:3000';
const webhook = 'https://webhook.site/4eb2bc1b-41dc-4892-88a3-8b7c1350ece0';
const merchantId = 1;

describe('Notification test scenarios', () => {
    it('should updated merchants notification url and key', async () => {
        const merchant = await request(url)
        .patch(`/merchants/${merchantId}`)
        .set('Accept', 'application/json')
        .send({
            notification_url: webhook,
            notification_key: "merchant-unique-token",
        }).expect(200);

        expect(merchant.body.notification_url).toBe(webhook);
        expect(merchant.body.notification_key).toBe('merchant-unique-token');
    })

    it('should error on notification test if parameters are missing', async () => {
        await request(url)
        .post(`/notifications/${merchantId}/notify/test`)
        .set('Accept', 'application/json')
        .send().expect(400);
    })

    it('should error on notification test if notification type sent does not exist', async () => {
        await request(url)
        .post(`/notifications/${merchantId}/notify/test`)
        .set('Accept', 'application/json')
        .send({
            notification_type: 'random'
        }).expect(400);
    })

    it('should error on notification test if merchant url is not ste', async () => {
        await request(url)
        .post(`/notifications/3/notify/test`)
        .set('Accept', 'application/json')
        .send({
            notification_type: 'invoice'
        }).expect(400);
    })

    it('should error on notification test if merchant url is not set', async () => {
        await request(url)
        .post(`/notifications/3/notify/test`)
        .set('Accept', 'application/json')
        .send({
            notification_type: 'invoice'
        }).expect(400);
    })

    it('should successfully notify merchant', async () => {
        const merchant = await request(url)
        .post(`/notifications/${merchantId}/notify/test`)
        .set('Accept', 'application/json')
        .send({
            notification_type: 'invoice'
        }).expect(200);
    })
});

describe('Notification retry scenarios', () => {
    let merchant;
    it('should update merchant url to an invalid url', async () => {
        merchant = await request(url)
        .patch(`/merchants/${merchantId}`)
        .set('Accept', 'application/json')
        .send({
            notification_url: 'https://webhook.site/52dcefa4-77bc-444d-b0f9-7a605e88c04155512355',
            notification_key: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        }).expect(200);

        expect(merchant.body.notification_url).toBe('https://webhook.site/52dcefa4-77bc-444d-b0f9-7a605e88c04155512355');
    })

    it('should create a failed notification', async () => {
        await request(url)
        .post(`/notifications/${merchantId}/notify`)
        .set('Accept', 'application/json')
        .set('X-Idempotency-Key', merchant.body.notification_key)
        .send({
            notification_type: 'invoice',
            payload: {
                test: 'test'
            }
        }).expect(200);

        await new Promise(resolve => setTimeout(resolve, 60000));
    }, 120000)

    it('should update merchant url to an invalid url', async () => {
        merchant = await request(url)
        .patch(`/merchants/${merchantId}`)
        .set('Accept', 'application/json')
        .send({
            notification_url: 'https://webhook.site/52dcefa4-77bc-444d-b0f9-7a605e88c04155512355',
            notification_key: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        }).expect(200);

        expect(merchant.body.notification_url).toBe('https://webhook.site/52dcefa4-77bc-444d-b0f9-7a605e88c04155512355');
    })

    it('should retry a failed notification', async () => {
        const notification = await request(url)
        .get(`/notifications/last-failed`)
        .set('Accept', 'application/json')
        .expect(200);

        await request(url)
        .patch(`/notifications/${notification.body.id}`)
        .set('Accept', 'application/json')
        .send({
            notification_url: webhook
        })
        .expect(200);

        await request(url)
        .post(`/notifications/${notification.body.id}/retry`)
        .set('Accept', 'application/json')
        .expect(200);
    })
})

describe('Notification scenarios', () => {
    let merchant;
    it('should update merchant url to a valid url', async () => {
        merchant = await request(url)
        .patch(`/merchants/${merchantId}`)
        .set('Accept', 'application/json')
        .send({
            notification_url: webhook,
            notification_key: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        }).expect(200);

        expect(merchant.body.notification_url).toBe(webhook);
    })

    it('should error on notification request with missing parameters ', async () => {
        await request(url)
        .post(`/notifications/${merchantId}/notify`)
        .set('Accept', 'application/json')
        .set('X-Idempotency-Key', merchant.body.notification_key)
        .send().expect(400);
    })

    it('should error on notification request with missing idempotency key header ', async () => {
        await request(url)
        .post(`/notifications/${merchantId}/notify`)
        .set('Accept', 'application/json')
        .send({
            notification_type: 'bank_transfer',
            payload: {
                test: 'test',
            }
        }).expect(400);
    })

    it('should error on notification request with invalid parameters', async () => {
        await request(url)
        .post(`/notifications/${merchantId}/notify`)
        .set('Accept', 'application/json')
        .set('X-Idempotency-Key', merchant.body.notification_key)
        .send({
            notification_type: 'bank_transfer',
        }).expect(400);
    })

    it('should successfully notify merchant', async () => {
        await request(url)
        .post(`/notifications/${merchantId}/notify`)
        .set('Accept', 'application/json')
        .set('X-Idempotency-Key', merchant.body.notification_key)
        .send({
            notification_type: 'bank_transfer',
            payload: {
                test: 'test',
            }
        }).expect(200);
    })

    it('should error on sending a duplicate idempotency key', async () => {
        await request(url)
        .post(`/notifications/${merchantId}/notify`)
        .set('Accept', 'application/json')
        .set('X-Idempotency-Key', merchant.body.notification_key)
        .send({
            notification_type: 'bank_transfer',
            payload: {
                test: 'test',
            }
        }).expect(400);
    })

    it('should update merchant url to a blank url', async () => {
        merchant = await request(url)
        .patch(`/merchants/${merchantId}`)
        .set('Accept', 'application/json')
        .send({
            notification_url: '',
            notification_key: 'merchant-unique-token',
        }).expect(200);

        expect(merchant.body.notification_url).toBe('');
    })

    it('should error on notifiying a merchant without a url set', async () => {
        await request(url)
        .post(`/notifications/3/notify`)
        .set('Accept', 'application/json')
        .set('X-Idempotency-Key', merchant.body.notification_key)
        .send({
            notification_type: 'bank_transfer',
            payload: {
                test: 'test',
            }
        }).expect(400);
    })
})
