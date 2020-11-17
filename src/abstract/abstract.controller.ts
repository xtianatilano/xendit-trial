import express, { Response } from 'express';

export abstract class AbstractController {
    public router = express.Router();

    abstract initRoutes (): void;

    ok (response: Response, data?: object | object[]): Response<any> {
        return response.status(200).json(data);
    }

    created (response: Response, data?: object): Response<any> {
        return response.status(201).json(data);
    }

    fail (response: Response, errorMessage?) {
        return response.status(errorMessage.statusCode).json(errorMessage);
    }
}