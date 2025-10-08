import { openOrders, users } from "../db";
import { currentPrice } from "./currentPrice";

export function closeOrder(orderId:string) {
    const order = openOrders.find(o => o.orderId === orderId);
    try {    
        if (order === undefined) throw new Error("couldnt find order");
        //update user balance
        users.map((user) => {
            if (user.userId === order.userId) {
                if (order.type === "long") {
                    const bidPrice = currentPrice(order.asset,"bid");
                    if (typeof(bidPrice) !== "number") return bidPrice;
                    const sellingPrice = (order.qty * order.leverage) * bidPrice;
                    const pnl = sellingPrice - order.amount;
                    user.balance.margin -= Math.round(order.margin) * 100;
                    user.balance.amount += (Math.round(order.margin) + (pnl)) * 100;
                    return
                } else if(order.type === "short") {
                    const askPrice = currentPrice(order.asset,"ask");
                    if (typeof(askPrice) !== "number") return askPrice;
                    const buyingPrice = (order.qty * order.leverage) * askPrice;
                    const pnl = order.amount - buyingPrice;
                    user.balance.margin -= Math.round(order.margin) * 100;
                    user.balance.amount += pnl * 100;
                    return
                }
            }
        })
        
        //remove order from openOrders

    } catch (err) {
        console.log(err);
        return "Error while closing order";
    }
    
}

