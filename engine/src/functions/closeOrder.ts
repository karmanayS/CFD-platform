import { OpenOrders, Prices, User } from "../types";

export function closeOrder(userId:string,orderId:string,openOrders:OpenOrders[],users:User[],prices:Prices[]) {
    try {    
        for (let i=0;i<openOrders.length;i++) {
            if (openOrders[i].orderId === orderId) {
                for (let j =0;j<users.length;j++) {
                    if (users[j].userId === userId) {
                        openOrders[i].type === "long" ? users[j].balance.amount += (openOrders[i].qty * ((prices.find(e => e.asset === openOrders[i].asset)?.bidPrice !)/((openOrders[i].asset === "BTC") ? 10000 : 1000000))) * 100 :

                        users[j].balance.amount += (users[j].balance.locked - (openOrders[i].qty * ((prices.find(e => e.asset === openOrders[i].asset)?.askPrice !)/((openOrders[i].asset === "BTC") ? 10000 : 1000000))) * 100)
                    }
                }
            }
        }
        return "SUCCESS";
    } catch (err) {return "FAILED"}    
}