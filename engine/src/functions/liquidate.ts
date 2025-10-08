import { OpenOrders, Prices, User } from "../types";

export default function liquidate(openOrders:OpenOrders[],prices:Prices[],users:User[]) {
    for (let i=0;i<openOrders.length;i++) {
        const order = openOrders[i];
        const asset = order.asset;
        const margin = order.margin;
        const userId = order.userId;

        let currentPrice:number  
        let liquidationPrice:number;
        if (order.type === "long") {
            currentPrice = order.qty * order.leverage * ((prices.find(e => e.asset === asset)?.bidPrice as number) / ((openOrders[i].asset === "BTC") ? 10000 : 1000000)) 
            liquidationPrice = (order.amount - margin) / 100
            
            if (currentPrice <= liquidationPrice) {
                //update user balance
                //here below, loss will be equal to margin so instead of doing user.balance.amount += margin + pnl(here pnl will be -ve of margin so this will become zero) as we do incase of closing orders manually, we can just make user margin and locked equal to zero instead of doing that calculation as it achieves the same thing
                for (const user of users) {
                    if (user.userId === userId) {
                        user.balance.margin = 0;
                        //user.balance.locked = 0;
                    } 
                }
                //remove from open orders
                const index = openOrders.indexOf(order);
                openOrders.splice(index,1);
            }
        } else {
            currentPrice = order.qty * order.leverage * ((prices.find(e => e.asset === asset)?.askPrice as number) / ((openOrders[i].asset === "BTC") ? 10000 : 1000000));
            liquidationPrice = (order.amount + margin) / 100;

            if (currentPrice >= liquidationPrice) {
                //update user balance
                for (const user of users) {
                    if (user.userId === userId) {
                        user.balance.margin = 0;
                        //user.balance.locked = 0;
                    } 
                }
                //remove from open orders
                const index = openOrders.indexOf(order);
                openOrders.splice(index,1);
            }
        }
    }
}