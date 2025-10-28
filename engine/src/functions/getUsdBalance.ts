import { User } from "../types";

export function getUsdBalance(userId:string, users:User[]) {
    const userBalance = users.find(u => u.userId === userId)?.balance.amount as number / 100;
    const userMargin = users.find(u => u.userId === userId)?.balance.margin as number / 100;
    const balance = userBalance?.toString()
    const margin = userMargin?.toString()
    return { balance, margin }         
}