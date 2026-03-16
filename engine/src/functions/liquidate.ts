import { scaleFactor } from "../helpers/scaleFactor";
import { OpenOrders, Prices, User } from "../types";
import { currentPrice } from "./currentPrice";

export default function liquidate(openOrders:OpenOrders[],prices:Prices[],users:User[]) {
    for (let i=0;i<openOrders.length;i++) {
        const order = openOrders[i];
        const asset = order.asset;
        const margin = order.margin;
        const userId = order.userId;

        let crntPrice:number  
        let liquidationPrice:number
        if (order.type === "long") {
            crntPrice = currentPrice(asset,"bid") * scaleFactor(asset)
            liquidationPrice = order.amount - margin
            
            if (crntPrice <= liquidationPrice) {
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
                i--;
            }
        } else {
            crntPrice = currentPrice(asset,"ask") * scaleFactor(asset)
            liquidationPrice = order.amount + margin

            if (crntPrice >= liquidationPrice) {
                //update user balance
                for (const user of users) {
                    if (user.userId === userId) {
                        user.balance.margin -= order.margin
                    } 
                }
                //remove from open orders
                const index = openOrders.indexOf(order);
                openOrders.splice(index,1);
                i--;
            }
        }
    }
}