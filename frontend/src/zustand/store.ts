import { create } from 'zustand'
import axios from "axios"

interface BalanceState {
    error: null | string
    loading: boolean
    balance: number
    fetchBalance: () => Promise<void>
}

export const useBalanceStore = create<BalanceState>()((set) => ({
    error: null,
    loading: false,
    balance: 0,
    fetchBalance: async() => {
        try {
            set({loading: true,error:null})
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/balance/usd`,{
                withCredentials: true
            })
            if (!res.data.success) throw new Error(res.data.message)
            set({balance: Number(res.data.usdBalance.balance), loading: false,error:null}) 
        } catch(err) {
            if (err instanceof Error) {
                set({loading: false, error:err.message})
            }
        }
    } 
}))

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

interface OpenOrdersState {
    error: null | string
    loading: boolean
    openOrders: OpenOrders[]
    fetchOpenOrders: () => Promise<void>
}

export const useOpenOrdersStore = create<OpenOrdersState>()((set) => ({
    error: null,
    loading: false,
    openOrders: [],
    fetchOpenOrders: async() => {
        try {
            set({loading: true,error:null})
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/openOrders`,{
                withCredentials: true
            })
            if (!res.data.success) throw new Error(res.data.message)
            set({openOrders: res.data.openOrders,loading:false,error:null})    
        } catch (err) {
            if (err instanceof Error) {
                set({error: err.message,loading:false})
            }
        }
    } 
})) 

