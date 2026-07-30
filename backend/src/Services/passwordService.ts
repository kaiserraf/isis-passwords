import chalk from "chalk";
import * as pr from '../Repositories/passwordRepository';
import * as crypto from '../utils/crypto';
import { PasswordModel } from "../Models/passwordModel";

type PsswdPatchFields = Partial<Pick<PasswordModel, 'passwordEncrypted' | 'service' | 'username' | 'fav'>>;

export const getAllPsswdService = async () => {
    const data = await pr.selectAllPsswd();
    if(!data) return null;
    return data;
};

export const getPsswdByIdService = async (id:number) => {
    const data = await pr.selectPsswdById(id);
    if(!data) return null;
    if(!data.passwordEncrypted) throw new Error("Registro corrompido"); // para aqui (mensagem de Registro corrompido)
    data.passwordEncrypted = await crypto.decrypt(data?.passwordEncrypted);
    return data;
};

export const postPsswdService = async (password:PasswordModel) => {
    if(password.passwordEncrypted){
        password.passwordEncrypted = await crypto.encrypt(password.passwordEncrypted);
    }else{
        let generate = Math.random().toString(36).slice(-10);
        password.passwordEncrypted = await crypto.encrypt(generate);
    }
    const data = await pr.insertPsswd(password);
    return data;
};

export const patchPsswdService = async (id:number, fields:PsswdPatchFields) => {
    const data = { ...fields };
    if(data.passwordEncrypted) data.passwordEncrypted = await crypto.encrypt(data.passwordEncrypted);
    return await pr.updatePsswd(id, data);
};

export const deletePsswdService = async (id:number) => {
    const data = await pr.deletePsswd(id);
    if(!data) return null;
    return data;
};