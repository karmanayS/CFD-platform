import { OpenOrders, Prices, User } from "../types";

export function liquidation(orderId:string,prices:Prices[],openOrders:OpenOrders[],userId:string,users:User[]) {
    for (let i =0 ; i<openOrders.length;i++) {
        if (openOrders[i].orderId === orderId) {
            const margin = openOrders[i].margin;
            const qty = openOrders[i].qty;

            let currentPrice:number;
            if (openOrders[i].type === "long") {
                currentPrice = qty * openOrders[i].leverage * ((prices.find(p => p.asset === openOrders[i].asset)?.bidPrice!) / ((openOrders[i].asset === "BTC") ? 10000 : 1000000))  
            } else {
                currentPrice = qty * openOrders[i].leverage * ((prices.find(p => p.asset === openOrders[i].asset)?.askPrice!) / ((openOrders[i].asset === "BTC") ? 10000 : 1000000))
            }

            const loss = openOrders[i].amount - currentPrice
            
            if (loss === margin) {
                for(let i=0;i<users.length;i++) {
                    if (users[i].userId === userId) {
                        users[i].balance.margin = 0;
                        //remove order from openOrders
                        const order = openOrders.find(o => o.orderId === orderId)
                        const index = openOrders.indexOf(order!)
                        openOrders.splice(index,1);
                        break
                    }
                }
                return "liquidated";
            }
        } else {
            console.log("no open order with the following order ID");
            return 
        }
    }
}