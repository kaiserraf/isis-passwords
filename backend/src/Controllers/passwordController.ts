import { Request, Response } from "express";
import * as service from "../Services/passwordService";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import chalk from "chalk";


export const getAllPsswd = async (req:Request, res:Response) => {
    try {
        const response = service.getAllPsswdService();
        if(response) res.status(StatusCodes.OK).json(response);
        else res.status(StatusCodes.NO_CONTENT);
    } catch (error) {
        console.error(chalk.red(error));
    }
};

export const getPsswdById = async (req:Request, res:Response) => {
    
};

export const postPsswd = async (req:Request, res:Response) => {
    
};

export const patchPsswd = async (req:Request, res:Response) => {
    
};

export const deletePsswd = async (req:Request, res:Response) => {
    
};