import pool from '../config/db'
import { PasswordModel } from '../Models/passwordModel';

export const selectAllPsswd = async ():Promise<PasswordModel[] | null> => {
    const result = await pool.query(``);
    return result.rows;
};

export const selectPsswdById = async () => {
    
};

export const insertPsswd = async () => {
    
};

export const updatePsswd = async () => {
    
};

export const deletePsswd = async () => {
    
};

