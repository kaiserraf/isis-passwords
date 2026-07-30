export interface PasswordModel{
    id: number,
    passwordEncrypted: string,
    service: string,
    username: string,
    createdAt: Date,
    updatedAt: Date,
    fav: boolean
}