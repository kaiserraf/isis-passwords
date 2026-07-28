import chalk from "chalk";
import * as pr from '../Repositories/passwordRepository';

export const getAllPsswdService = async () => {
    try {
        const data = pr.selectAllPsswd();
        return data;
    } catch (error) {
        console.error(chalk.red(error));
    }
};

export const getPsswdByIdService = async () => {
    
};

export const postPsswdService = async () => {
    
};

export const patchPsswdService = async () => {
    
};

export const deletePsswdService = async () => {
    
};