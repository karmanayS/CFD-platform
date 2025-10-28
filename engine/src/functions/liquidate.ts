import { OpenOrders, Prices, User } from "../types";

export default function liquidate(openOrders:OpenOrders[],prices:Prices[],users:User[]) {
    for (let i=0;i<openOrders.length;i++) {
        const order = openOrders[i];
        const asset = order.asset;
        const margin = order.margin;
        const userId = order.userId;

        let currentPrice:number  
        let liquidationPrice:number
        if (order.type === "long") {
            currentPrice = order.qty * order.leverage * ((prices.find(e => e.asset === asset)?.bidPrice as number) / ((openOrders[i].asset === "BTC") ? 10000 : 1000000)) 
            liquidationPrice = (order.amount - margin) / 100
            
            if (currentPrice <= liquidationPrice) {
                //update user balance
                //here below, loss will be equal to margin so we can make the margin 0 for that order and we dont add anything to the balance of the user because the margin is completely lost and the loss is 100%
                for (const user of users) {
                    if (user.userId === userId) {
                        user.balance.margin -= order.margin;
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
                        user.balance.margin -= order.margin
                        user.balance.amount -= order.margin //because margin is the PNL in this case and for short orders we are not subtracting margin from the balance when placing order and just adding PNL to the balance when closing order so here PNL = margin
                    } 
                }
                //remove from open orders
                const index = openOrders.indexOf(order);
                openOrders.splice(index,1);
            }
        }
    }
}