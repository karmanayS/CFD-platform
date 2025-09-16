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
        margin:number,
        locked : number //contains leverage money from the exchange
    }
}

export interface OpenOrders {
    userId: string,
    orderId : string,
    asset : string,
    type : "long" | "short",
    qty: number,
    leverage : number,
    amount:number,
    margin: number
}

export interface SupportedAssets {
    symbol  : string,
    name : string,
    imageUrl : string
}