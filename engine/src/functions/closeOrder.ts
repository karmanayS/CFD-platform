import { OpenOrders, User } from "../types";
import { currentPrice } from "./currentPrice";

export function closeOrder(orderId:string,userId:string,openOrders:OpenOrders[],users:User[]) {
    const order = openOrders.find(o => o.orderId === orderId && o.userId === userId);
    try {    
        if (order === undefined) throw new Error("couldnt find order");
        //update user balance
        const user = users.find(u => u.userId === order.userId)
        if (!user) throw new Error("user not found")
        if (order.type === "long") {
            const bidPrice = currentPrice(order.asset,"bid");
            const sellingPrice = (order.qty * order.leverage) * bidPrice;
            const pnl = sellingPrice - order.amount;
            user.balance.margin -= Math.round(order.margin * 100);
            user.balance.amount += Math.round((order.margin + pnl) * 100);
        }
        else if(order.type === "short") {
            const askPrice = currentPrice(order.asset,"ask");
            const buyingPrice = (order.qty * order.leverage) * askPrice;
            const pnl = order.amount - buyingPrice;
            user.balance.margin -= Math.round(order.margin * 100);
            user.balance.amount +=  Math.round((order.margin + pnl) * 100);
        }     
        //remove order from openOrders
        const index = openOrders.indexOf(order);
        openOrders.splice(index,1);
        return "Successfully closed order";
    } catch (err) {
        console.log(err);
        return "ERROR";
    }
    
}

