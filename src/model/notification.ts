export interface Notification {
    id: number;
    notification_url: string;
    merchant_id: number;
    notification_payload: object;
    notification_type: string;
    idempotency_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}