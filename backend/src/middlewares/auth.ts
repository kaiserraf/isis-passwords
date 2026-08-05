import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';

declare global{
    namespace Express{
        interface Request{
            user?: string | jwt.JwtPayload;
        }
    }
}

export const authToken = async (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.header('authorization');
    const token = authHeader?.split('')[1];

    const secret = process.env.JWT_SECRET;
    if(!secret) throw new Error('JWT_SECRET não definido nas variáveis ambiente');
    
    if(!token) return res.sendStatus(StatusCodes.UNAUTHORIZED).send();
    jwt.verify(token, secret, (error, user) =>{
        if(error) return res.sendStatus(StatusCodes.UNAUTHORIZED).send();
        req.user = user;
        next();
    });
}