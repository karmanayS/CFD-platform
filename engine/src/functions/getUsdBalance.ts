import { User } from "../types";

export function getUsdBalance(userId:string, users:User[]) {
    const user = users.find(u => u.userId === userId);
    if (!user) {
        console.log("user doesnt exist")    
        return { balance: "0", margin: "0" }
    };
    const balance = (user.balance.amount / 100).toString();
    const margin = (user.balance.margin / 100).toString();
    return { balance, margin }
}