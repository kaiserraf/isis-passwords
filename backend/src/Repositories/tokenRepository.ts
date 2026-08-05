import pool from "../config/db";
import { TokenModel } from "../Models/tokenModel";

export const saveRefreshToken = async (userId:number, token:string, expiresAt:Date):Promise<TokenModel | null> => {
    const result = await pool.query<TokenModel>(
        `INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES ($1, $2, $3) RETURNING
        id, user_id AS "userId",
        token,
        expires_at AS "expiresAt",
        created_at AS "createdAt"`,
        [userId, token, expiresAt]
    );
    const t = result.rows[0];
    if(!t) throw new Error("Falha ao salvar token");
    return t;
}

export const findRefreshToken = async (token:string):Promise<TokenModel> => {
    const result = await pool.query(
        `SELECT id, user_id AS "userId", token, expires_at AS "expiresAt" FROM refresh_tokens
        WHERE token = $1 AND expires_at > NOW()`,
        [token]
    );
    return result.rows[0] ?? null;
}

export const deleteRefreshToken = async (token:string):Promise<TokenModel | null> => {
    const result = await pool.query(
        `DELETE FROM refresh_tokens WHERE token = $1
        RETURNING
        id, user_id AS "userId",
        token,
        expires_at AS "expiresAt",
        created_at AS "createdAt"`,
        [token]
    );
    return result.rows[0] ?? null;
}