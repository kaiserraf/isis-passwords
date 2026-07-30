import chalk from 'chalk';
import pool from '../config/db'
import { PasswordModel } from '../Models/passwordModel';

type PsswdPatchFields = Partial<Pick<PasswordModel, 'passwordEncrypted' | 'service' | 'username' | 'fav'>>;

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

export const updatePsswd = async (id:number, fields: PsswdPatchFields):Promise<PasswordModel | null> => {
    const keys = Object.keys(fields) as (keyof PsswdPatchFields)[];
    if(keys.length === 0) return null;
    const setClauses = keys.map((key, index) => `${key} = ${index +1}`);
    const values = keys.map((key) => fields[key]);
    setClauses.push(`"updatedat" = NOW()`);

    const result = await pool.query<PasswordModel>(`
        UPDATE passwords
        SET ${setClauses.join(", ")}
        WHERE id = $${keys.length + 1}
        RETURNING *`, [...values, id]);
    return result.rows[0] ?? null;
};

export const deletePsswd = async (id:number):Promise<PasswordModel | null> => {
    const result = await pool.query<PasswordModel>(
        `DELETE FROM passwords WHERE id = $1 RETURNING *`, [id]
    );
    return result.rows[0] ?? null;
};

