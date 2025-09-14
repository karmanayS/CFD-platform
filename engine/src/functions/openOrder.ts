import { OpenOrders, Prices, User } from "../types";

export function createOrder(newOrder:OpenOrders,users:User[],openOrders:OpenOrders[],prices:Prices[]) {
    try {
        if (newOrder) {
            let orderAmount:number;
            
            newOrder.type === "long" ? orderAmount = (newOrder.qty * ((prices.find(e => e.asset === newOrder.asset)?.askPrice !) / ((newOrder.asset === "BTC") ? 10000 : 1000000))) :
            
            orderAmount = (newOrder.qty * ((prices.find(e => e.asset === newOrder.asset)?.bidPrice !) / ((newOrder.asset === "BTC") ? 10000 : 1000000)));

            for (let i = 0;i<users.length;i++) {
                if (users[i].userId === newOrder.userId) {
                    newOrder.type === "long" ? users[i].balance.amount -= Math.floor(orderAmount * 100) : 
                    users[i].balance.locked += Math.floor(orderAmount * 100) 
                    break 
                }
            }
            const orderId = crypto.randomUUID();
            openOrders.push({
                userId: newOrder.userId,
                orderId,
                asset : newOrder.asset,
                type : newOrder.type,
                qty : newOrder.qty,
                amount : orderAmount
            })
            console.log(openOrders.find(o => o.orderId === orderId));
            return orderId;
        } else throw new Error("cant get new order from stream")

    } catch (error) {
        return console.log(error);
    }
}