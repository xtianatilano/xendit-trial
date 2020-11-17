import request from 'supertest';

describe('Notification Integration Testing', () => {
    it('should add notify merchant url', async () => {
        const merchant = await request('http://localhost:3000')
        .patch('/merchants/')
        .set('Accept', 'application/json')
        .send({
            notification_url: 'https://webhook.site/52dcefa4-77bc-444d-b0f9-7a605e88c041',
            notification_key: "customer-unique-token",
        }).expect(200);

        expect(merchant.body.notification_url).toBe(0);
    })
});
