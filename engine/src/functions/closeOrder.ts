import { OpenOrders, Prices, User } from "../types";

export function closeOrder(userId:string,orderId:string,openOrders:OpenOrders[],users:User[],prices:Prices[]) {
    try {    
        for (let i=0;i<openOrders.length;i++) {
            if (openOrders[i].orderId === orderId) {
                for (let j =0;j<users.length;j++) {
                    if (users[j].userId === userId) {

                        let closePrice = 0;

                        if (openOrders[i].type === "long") {
                            closePrice = (openOrders[i].qty * openOrders[i].leverage) * ((prices.find(p => p.asset === openOrders[i].asset)?.bidPrice!) / ((openOrders[i].asset === "BTC") ? 10000 : 1000000))
                        } else if(openOrders[i].type === "short") {
                            closePrice = (openOrders[i].qty * openOrders[i].leverage) * ((prices.find(p => p.asset === openOrders[i].asset)?.askPrice!) / ((openOrders[i].asset === "BTC") ? 10000 : 1000000))
                        }

                        if (openOrders[i].type === "long") {
                            users[j].balance.locked = Math.floor(closePrice * 100) - users[j].balance.locked 
                        } else if (openOrders[i].type === "short") {
                            users[j].balance.locked -= Math.floor(closePrice * 100)
                        }    
                        users[j].balance.amount += users[j].balance.locked + users[j].balance.margin //you should subtract the margin amount from locked or else dont add margin here and just assign margin to be 0
                        users[j].balance.locked = 0;
                        users[j].balance.margin = 0; 
                        
                        //remove order from open orders
                        const order = openOrders.find(o => o.orderId === orderId)
                        const index = openOrders.indexOf(order!)
                        openOrders.splice(index,1);

                        console.log(openOrders);
                        break
                        // openOrders[i].type === "long" ? users[j].balance.amount += (openOrders[i].qty * ((prices.find(e => e.asset === openOrders[i].asset)?.bidPrice !)/((openOrders[i].asset === "BTC") ? 10000 : 1000000))) * 100 :

                        // users[j].balance.amount += (users[j].balance.locked - (openOrders[i].qty * ((prices.find(e => e.asset === openOrders[i].asset)?.askPrice !)/((openOrders[i].asset === "BTC") ? 10000 : 1000000))) * 100)
                    }
                }
            }
            break
        }
        return "SUCCESS";
    } catch (err) {return "FAILED"}    
}