import { configureStore } from "@reduxjs/toolkit";
import balanceReducer from "./slices/balanceSlice"
import openOrderReducer from "./slices/openOrderSlice"

export const store = configureStore({
    reducer : {
        balance : balanceReducer,
        openOrders : openOrderReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch