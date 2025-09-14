export interface Prices {
    asset: string,
    bidPrice : number,
    askPrice: number,
    decimal: number
}

export interface User {
    userId : string,
    balance : {
        amount : number,
        locked : number
    }
}

export interface OpenOrders {
    userId: string,
    orderId : string,
    asset : string,
    type : "long" | "short",
    qty: number,
    amount: number
}

export interface SupportedAssets {
    symbol  : string,
    name : string,
    imageUrl : string
}