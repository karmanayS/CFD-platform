import { OpenOrders, Prices, User } from "../types";

interface NewOrder {
    asset:string,
    type: OrderType,
    qty:number,
    leverage:number,
    userId:string
}

enum OrderType {
    long="long",
    short="short"
}

export function createOrder(newOrder:NewOrder,users:User[],openOrders:OpenOrders[],prices:Prices[]) {
    try {
        if (newOrder) {
            const qty = newOrder.qty;
            const leverage = newOrder.leverage;

            let margin;
            newOrder.type === "long" ? margin = qty * ((prices.find(p => p.asset === newOrder.asset)?.askPrice!) / ((newOrder.asset === "BTC") ? 10000 : 1000000)) : 
            margin = qty * ((prices.find(p => p.asset === newOrder.asset)?.bidPrice!) / ((newOrder.asset === "BTC") ? 10000 : 1000000))

            const locked = margin * leverage;

            // let orderAmount:number;
            
            // newOrder.type === "long" ? orderAmount = (newOrder.qty * ((prices.find(e => e.asset === newOrder.asset)?.askPrice !) / ((newOrder.asset === "BTC") ? 10000 : 1000000))) :
            
            // orderAmount = (newOrder.qty * ((prices.find(e => e.asset === newOrder.asset)?.bidPrice !) / ((newOrder.asset === "BTC") ? 10000 : 1000000)));

            for (let i = 0;i<users.length;i++) {
                if (users[i].userId === newOrder.userId) {
                    if (margin > users[i].balance.amount) throw new Error("invalid balance");
                    
                    users[i].balance.amount -= Math.floor(margin * 100);
                    users[i].balance.margin = Math.floor(margin * 100);  
                    users[i].balance.locked = Math.floor(locked * 100);
                    // newOrder.type === "long" ? users[i].balance.amount -= Math.floor(margin * 100) : 
                    // users[i].balance.locked += Math.floor(margin * 100) 
                    break 
                }
            }
            const orderId = crypto.randomUUID();
            openOrders.push({
                userId: newOrder.userId,
                orderId,
                asset : newOrder.asset,
                type : newOrder.type,
                qty,
                leverage,
                margin, 
                amount : locked,
            })
            console.log(openOrders.find(o => o.orderId === orderId));
            return orderId;
        } else throw new Error("cant get new order from stream")

    } catch (error) {
        return console.log(error);
    }
}