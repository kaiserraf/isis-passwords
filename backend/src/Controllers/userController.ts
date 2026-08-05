import chalk from 'chalk';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as us from '../Services/userService';

export const login = async (req:Request, res:Response) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) return res.status(StatusCodes.BAD_REQUEST).send();
        const response = await us.loginService(email, password);
        if(response) res.status(StatusCodes.OK).json(response);
        else res.status(StatusCodes.UNAUTHORIZED).send();
    } catch (error) {
        console.error(chalk.red(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const register = async (req:Request, res:Response) => {
    try {
        const bodyValue = req.body;
        const response = await us.registerService(bodyValue);
        if(response) res.status(StatusCodes.CREATED).json(response);
        else res.status(StatusCodes.BAD_REQUEST).send();
    } catch (error) {
        console.error(chalk.red(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const refresh = async (req:Request, res:Response) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Refresh token não fornecido'
        });
        const response = await us.refreshService(refreshToken);
        if(!response) return res.status(StatusCodes.BAD_REQUEST).send();
        return res.status(StatusCodes.OK).json(response); 
    } catch (error) {
        console.error(chalk.red(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
}

export const logout = async (req:Request, res:Response) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) return res.status(StatusCodes.BAD_REQUEST).send();
        const response = await us.logout(refreshToken);
        if(!response) return res.status(StatusCodes.BAD_REQUEST).send();
        return res.status(StatusCodes.OK).json({
            message: "logout realizado"
        });
    } catch (error) {
        console.error(chalk.red(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
}