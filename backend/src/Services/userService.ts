import { randomBytes } from "node:crypto";
import { UserModel } from "../Models/userModel";
import * as ur from "../Repositories/userRepository";
import * as hash from '../utils/crypto';
import * as tk from '../Repositories/tokenRepository';
import * as jwt from 'jsonwebtoken';

const valideJWTSecret = async () => {
    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret) throw new Error('JWT_SECRET não definido');
    return jwtSecret;
}

export const loginService = async (email:string, password:string) => {
    email = email.toLowerCase().trim();
    const secret = await valideJWTSecret();

    const data = await ur.loginUser(email);
    if(!data) return null;
    const validPassword = await hash.comparePassword(password, data.passwordHash);
    if(validPassword == false) return null;

    const acessToken = jwt.sign({id: data.id}, secret, {expiresIn: '15m'});
    const refreshToken = randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const save = await tk.saveRefreshToken(data.id, refreshToken, expiresAt);

    return {acessToken, refreshToken};
};

export const registerService = async (user:UserModel) => {
    user.email = user.email.toLowerCase().trim();
    user.passwordHash = await hash.hashPassword(user.passwordHash);
    
    const data = await ur.registerUser(user);
    if(!data) return null;
    return data;
};

export const refreshService = async (token:string) => {
    const secret = await valideJWTSecret();

    const stored = await tk.findRefreshToken(token);
    if(!stored) return null;
    
    await tk.deleteRefreshToken(token);
    
    const newAcessToken = jwt.sign({id: stored.userId}, secret, {expiresIn: '15m'});
    const newRefreshToken = randomBytes(64).toString('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await tk.saveRefreshToken(stored.userId, newRefreshToken, expiresAt);

    return {acessToken: newAcessToken, refreshToken: newRefreshToken};
}

export const logout = async (token:string) => {
    const data =await tk.deleteRefreshToken(token);
    if(!data) return null;
    return data;
}