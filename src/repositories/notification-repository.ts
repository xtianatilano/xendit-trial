import { QueryResult } from 'pg';

import { pool } from '../database';
import { Notification } from '../model/notification';
import { generateInsertPlaceholder, generateValuePlaceholder } from '../util/database-helper';
import { ErrorHandler } from '../util/error-handler';

class NotificationRepository {
    async create(data: {
        notificationUrl: string;
        merchantId: number;
        notificationType: string;
        notificationPayload: object;
        idempotencyKey?: string;
    }): Promise<Notification> {
        try {
            const result = await pool.query(`
                INSERT INTO "notifications" (${generateInsertPlaceholder(data)})
                VALUES (${generateValuePlaceholder(data)}) RETURNING *
            `, Object.values(data));

            return result.rows[0]
        } catch (error) {
            throw error;
        }
    };

    async getLastFailedNotification(): Promise<Notification> {
        try {
            const result: QueryResult = await pool.query(`SELECT * FROM "notifications" WHERE status = 'failed' LIMIT 1`, []);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getNotificationById(notificationId: string | number): Promise<Notification> {
        try {
            const result: QueryResult = await pool.query(`SELECT * FROM "notifications" WHERE id = $1`, [notificationId]);

            if (result.rows.length === 0) {
                throw new ErrorHandler(404, 'NOTIFICATION_NOT_FOUND', 'Resource doesn\'t exists.');
            }

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    };

    async getNotificationByIdempotencyKey(idempotencyKey: string | string[] | undefined): Promise<Notification[]> {
        try {
            const result: QueryResult = await pool.query(`SELECT * FROM "notifications" WHERE "idempotency_key" = $1`, [idempotencyKey]);

            return result.rows;
        } catch (error) {
            throw error;
        }
    };

    async notificationSuccess(id: number): Promise<void> {
        try {
            await pool.query(`
                UPDATE "notifications"
                SET "status" = 'completed', "updated_at" = NOW()
                WHERE id = $1
            `, [id]);
        } catch (error) {
            throw error;
        }
    };

    async notificationFailed(id: number): Promise<void> {
        try {
            await pool.query(`
                UPDATE "notifications"
                SET "status" = 'failed', "updated_at" = NOW()
                WHERE id = $1
            `, [id]);
        } catch (error) {
            throw error;
        }
    };
}

export const notificationRepository = new NotificationRepository();