import { OpenOrders, Prices, User } from "../types";
import { currentPrice } from "./currentPrice";

interface NewOrder {
    asset:string,
    type: "long" | "short",
    qty:number,
    leverage:number,
    userId:string
}

export function createOrder(newOrder:NewOrder,users:User[],openOrders:OpenOrders[],prices:Prices[]) {
    try {
        if (newOrder) {
            const qty = newOrder.qty;
            const leverage = newOrder.leverage;

            let margin;
            if (newOrder.type === "long") {
                const askPrice = currentPrice(newOrder.asset,"ask");
                if (typeof(askPrice) !== "number") return askPrice;
                margin = qty * askPrice; 
            } else if (newOrder.type === "short") {
                const bidPrice = currentPrice(newOrder.asset,"bid");
                if (typeof(bidPrice) !== "number") return bidPrice;
                margin = qty * bidPrice;
            } else throw new Error("Invalid type of order");

            //update user balance
            users.map((user) => {
                if (user.userId === newOrder.userId) {
                    if (margin > (user.balance.amount/100)) throw new Error("invalid balance");
                    if (newOrder.type === "long") {
                        user.balance.amount -= Math.round(margin) * 100
                        user.balance.margin = Math.round(margin) * 100
                        return
                    } else if (newOrder.type === "short") {
                        //here we dont decrease user balance because we are shorting so , we are getting money
                        //but make sure then when closing order that u dont add this margin to the balance and just add the pnl
                        user.balance.amount -= Math.round(margin) * 100 
                        user.balance.margin = Math.round(margin) * 100
                        return
                    }
                }
            })
            const orderId = crypto.randomUUID();
            openOrders.push({
                userId: newOrder.userId,
                orderId,
                asset : newOrder.asset,
                type : newOrder.type,
                qty,
                leverage,
                margin, 
                amount : margin * leverage,
            })
            return orderId;
        } else throw new Error("cant get new order from stream")

    } catch (error) {
        console.log(error);
        return "ERROR";
    }
}