import { Request, Response } from "express";
import * as service from "../Services/passwordService";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import chalk from "chalk";


export const getAllPsswd = async (req:Request, res:Response) => {
    try {
        const response = await service.getAllPsswdService();
        if(response) res.status(StatusCodes.OK).json(response);
        else res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        console.error(chalk.red(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const getPsswdById = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if(isNaN(id)) return res.status(StatusCodes.BAD_REQUEST).json({message: "Id invalido"});
        const response = await service.getPsswdByIdService(id);
        if(response) res.status(StatusCodes.OK).json(response);
        else res.status(StatusCodes.NOT_FOUND).send();
    } catch (error) {
        console.error(chalk.red(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const postPsswd = async (req:Request, res:Response) => {
    try {
        const bodyValue = req.body;
        const response = await service.postPsswdService(bodyValue);
        if(response) res.status(StatusCodes.OK).json(response);
        else res.status(StatusCodes.BAD_REQUEST).send();
    } catch (error) {
        console.error(chalk.red(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const patchPsswd = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Id invalido" });
        const { passwordEncrypted, service: serviceName, username, fav } = req.body;
        const fields = { passwordEncrypted, service: serviceName, username, fav };
        const cleanFields = Object.fromEntries(
            Object.entries(fields).filter(([, value]) => value !== undefined)
        );
        if (Object.keys(cleanFields).length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Nenhum campo para atualizar" });
        }
        const response = await service.patchPsswdService(id, cleanFields);
        if (response) return res.status(StatusCodes.OK).json(response);
        return res.status(StatusCodes.NOT_FOUND).send();
    } catch (error) {
        console.error(chalk.red(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const deletePsswd = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) return res.status(StatusCodes.BAD_REQUEST).json({message: "Id invalido"});
        const response = await service.deletePsswdService(id);
        if(response) return res.status(StatusCodes.OK).json(response);
        else res.status(StatusCodes.BAD_REQUEST).send();
    } catch (error) {
        console.error(chalk.red(error));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};