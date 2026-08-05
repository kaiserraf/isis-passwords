export interface TokenModel{
    id: number,
    userId: number,
    token: string,
    expiresAt: Date,
    createdAt: Date
}