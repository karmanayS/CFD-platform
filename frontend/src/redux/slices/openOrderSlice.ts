import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

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

interface InitialState {
    openOrders: OpenOrders[],
    loading : boolean,
    error : boolean
}

const initialState: InitialState = {
    openOrders: [],
    loading: false,
    error: false
}

export const fetchOpenOrders = createAsyncThunk("fetchOpenOrders",async() => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/openOrders?userId=user1`);
    return (response.data.openOrders)
})

const openOrderSlice = createSlice({
    name: "openOrders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchOpenOrders.fulfilled,(state,action) => {
            state.loading = false
            state.openOrders = action.payload
        })
        builder.addCase(fetchOpenOrders.pending,(state,action) => {
            state.loading = true
        })
        builder.addCase(fetchOpenOrders.rejected,(state,action) => {
            state.loading = false
            state.error = true
            console.log(action.payload)
        })
    }
})

export default openOrderSlice.reducer