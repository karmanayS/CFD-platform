import { OpenOrders, Prices, SupportedAssets, User } from "./types";

export const PRICES:Prices[] = [{
    asset: "BTC",
    bidPrice: 0,
    askPrice: 0,
    decimal: 4
}, { 
    asset: "SOL",
    bidPrice: 0,
    askPrice: 0,
    decimal: 6
}];

export const users:User[] = [{
    userId: "user1",
    balance: {
        amount :5000,
        locked : 0
    }
}];

export const openOrders:OpenOrders[] = [];

export const supportedAssets:SupportedAssets[] = [{
    symbol : "BTC",
    name : "Bitcoin",
    imageUrl : "enter image url"
}, {
    symbol : "SOL",
    name : "Solana",
    imageUrl : "enter image url"
}];

