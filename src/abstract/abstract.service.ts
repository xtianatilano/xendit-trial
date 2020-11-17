import { Request } from "express";

export abstract class AbstractService {
    logError(data: any, message: string) {
        console.error(message, {
            data: { data }
        });
    }
}