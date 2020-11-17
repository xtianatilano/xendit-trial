import { Request } from 'express';
import { QueryResult } from 'pg';

import { pool } from '../database';
import { Merchant } from '../model/merchant';
import { ErrorHandler } from '../util/error-handler';

class MerchantRepository {
    /**
     * Get all merchants
     */
    async getMerchants(): Promise<Merchant[]> {
        try {
            const result: QueryResult = await pool.query(`SELECT * FROM "merchants" ORDER BY id ASC`);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get merchant by id
     * @param merchantId merchant id
     */
    async getMerchantById(merchantId: string | number): Promise<Merchant> {
        try {
            const result: QueryResult = await pool.query(`SELECT * FROM "merchants" WHERE id = $1`, [merchantId]);

            if (result.rows.length === 0) {
                throw new ErrorHandler(404, 'NOT_FOUND', 'Data not found.');
            }

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async patchMerchant(req: Request): Promise<Merchant> {
        try {
            const merchant = await this.getMerchantById(req.params.merchantId);

            if (Object.values(req.body).length === 0) {
                return merchant;
            }

            const result = await pool.query(`
                UPDATE "merchants"
                SET "notification_url" = $2, "notification_key" = $3, "updated_at" = NOW()
                WHERE id = $1 RETURNING *
            `, [merchant.id, req.body.notification_url, req.body.notification_key]);

            if (result.rows.length === 0) {
                throw new ErrorHandler(404, 'NOT_FOUND', 'Data not found.');
            }

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

export const merchantRepository = new MerchantRepository();