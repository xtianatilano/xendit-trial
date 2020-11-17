import App from './app';
import bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger-middleware';
import errorMiddleware from './middleware/error-middleware';
import MerchantsController from './controllers/merchants.controller';
import NotificationController from './controllers/notifications.controller';

const app = new App({
    port: parseInt(process.env.LOCAL_SERVER_PORT as string, 10) || 3000,
    controllers: [
        new NotificationController(),
        new MerchantsController(),
    ],
    middlewares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware,
        errorMiddleware,
    ]
})

app.listen();