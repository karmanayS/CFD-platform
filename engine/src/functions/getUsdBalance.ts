import { User } from "../types";

export function getUsdBalance(userId:string, users:User[]) {
    const userBalance = users.find(u => u.userId === userId)?.balance.amount as number / 100;
    const balance = userBalance?.toString()
    return balance         
}