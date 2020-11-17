import { Request, Response } from 'express'

const loggerMiddleware = (req: Request, resp: Response, next) => {
    console.log('Request logged:', {
        path: req.path,
        method: req.method,
        params: req.params,
        body: req.body,
    })
    next()
}

export default loggerMiddleware