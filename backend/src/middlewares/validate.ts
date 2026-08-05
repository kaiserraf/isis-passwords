import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

export const validateBody = (req:Request, res:Response, next:NextFunction) => {
    const { passwordEncrypted,
            service,
            username } = req.body;

    if(!passwordEncrypted ||
       !service ||
       !username
    ) return res.status(StatusCodes.BAD_REQUEST).send();

    next();
}