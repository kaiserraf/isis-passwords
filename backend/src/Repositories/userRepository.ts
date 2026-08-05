import pool from '../config/db';
import { UserModel } from '../Models/userModel';


export const loginUser =  async (email:string):Promise<UserModel> => {
    const result = await pool.query<UserModel>(
        `SELECT
        id, 
        name,
        email,
        password_hash AS "passwordHash",
        created_at AS "createdAt"
        FROM users WHERE email = $1`, [email]
    );
    return result.rows[0] ?? null;
};

export const registerUser = async (user:UserModel):Promise<UserModel> => {
    const result = await pool.query<UserModel>(`INSERT INTO users
        (name, email, password_hash)
        VALUES ($1, $2, $3) RETURNING
        id, name, email, password_hash AS "passwordHash", created_at AS "createdAt"`,
        [user.name, user.email, user.passwordHash]
    );
    const u = result.rows[0];
    if(!u) throw new Error("Falha ao criar usuário");
    return u;
}