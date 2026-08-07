import chalk from 'chalk';
import pool from '../config/db'
import { PasswordModel } from '../Models/passwordModel';

export const selectAllPsswd = async ():Promise<PasswordModel[] | null> => {
    const result = await pool.query<PasswordModel>(`SELECT * FROM passwords ORDER BY id`);
    return result.rows;
};

export const selectPsswdById = async (id:number):Promise<PasswordModel | null> => {
    const result = await pool.query<PasswordModel>(`SELECT
        id,
        service,
        username,
        passwordencrypted AS "passwordEncrypted",
        fav,
        createdat AS "createdAt",
        updatedat AS "updatedAt"
        FROM passwords where id = $1`, [id]
    );
    return result.rows[0];
};

export const insertPsswd = async (password:PasswordModel):Promise<PasswordModel> => {
    const result = await pool.query<PasswordModel>(
        `INSERT INTO passwords (service, username, passwordEncrypted)
        VALUES ($1, $2, $3)
        RETURNING *`, [password.service, password.username, password.passwordEncrypted] 
    );
    const p = result.rows[0];
    if(!p) throw new Error(chalk.red("Falha ao criar a senha"));
    return p;
};

export const updatePsswd = async (id:number, password:Partial<{
    passwordEncrypted: string,
    service: string,
    username: string,
    updatedAt: Date,
    fav: boolean
}>):Promise<PasswordModel | null> => {
    const field: string[] = [];
    const value: unknown[] = [];
    let count = 1;

    if(password.passwordEncrypted){
        field.push(`passwordencrypted = $${count++}`);
        value.push(password.passwordEncrypted);
    }
    if(password.service){
        field.push(`service = $${count++}`);
        value.push(password.service);
    }
    if(password.username){
        field.push(`username = $${count++}`);
        value.push(password.username);
    }
    if(password.updatedAt){
        field.push(`updatedat = $${count++}`);
        value.push(password.updatedAt);
    }
    if(password.fav){
        field.push(`fav = $${count++}`);
        value.push(password.fav);
    }
    if(field.length === 0) return null;
    value.push(id);
    const result = await pool.query<PasswordModel>(
        `UPDATE passwords SET ${field.join(',')} WHERE id = $${count}
        RETURNING
        id,
        passwordencrypted AS "passwordEncrypted",
        username,
        fav,
        createdat AS "createdAt",
        updatedat AS "updatedAt"`, value
    );

    return result.rows[0] ?? null;
};

export const deletePsswd = async (id:number):Promise<PasswordModel | null> => {
    const result = await pool.query<PasswordModel>(
        `DELETE FROM passwords WHERE id = $1 RETURNING *`, [id]
    );
    return result.rows[0] ?? null;
};

