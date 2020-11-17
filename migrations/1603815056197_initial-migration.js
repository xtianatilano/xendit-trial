/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createType('notification_status', ['pending', 'completed', 'failed']);
    pgm.createType('notification_type', ['bank_transfer', 'invoice']);

    // create merchants table
    pgm.createTable('merchants', {
      id: 'id',
      name: {
        type: 'varchar(100)',
        notNull: true
      },
      notification_key: {
        type: 'text'
      },
      notification_url: {
        type: 'text',
      },
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
      updated_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
    })

    // create notifications table
    pgm.createTable('notifications', {
        id: 'id',
        notification_url: { type: 'varchar(100)', notNull: true },
        merchant_id: {
          type: 'integer',
          notNull: true,
          references: '"merchants"',
        },
        notification_payload: {
          type: 'json',
          notNull: true,
        },
        notification_type: {
          type: 'notification_type',
          notNull: true,
        },
        idempotency_key: {
          type: 'text',
        },
        status: {
          type: 'notification_status',
          default: 'pending'
        },
        created_at: {
          type: 'timestamp',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
        updated_at: {
          type: 'timestamp',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
    })

    // initial data for merchants
    pgm.sql(`INSERT INTO merchants ("name") VALUES ('merchant1'), ('merchant2'), ('merchant2');`)
}
