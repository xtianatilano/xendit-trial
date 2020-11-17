import { Request, Response } from 'express'
import { handleError } from '../util/error-handler'

const errorMiddleware = (err, req: Request, res: Response, next) => handleError(err, res);

export default errorMiddleware