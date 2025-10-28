import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

export const fetchBalance = createAsyncThunk("fetchBalance",async() => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/balance/usd?userId=user1`)
    const balance = parseFloat(response.data.usdBalance.balance);
    return balance
})

const balanceSlice = createSlice({
    name: "balance",
    initialState: {
        value: 0,
        loading: false,
        error: false
    },
    reducers: {},
    extraReducers : (builder) => {
        builder.addCase(fetchBalance.fulfilled,(state,action) => {
            state.loading = false;
            state.value = action.payload
        })
        builder.addCase(fetchBalance.pending,(state,action) => {
            state.loading = true;
        })
        builder.addCase(fetchBalance.rejected,(state,action) => {
            state.loading = false;
            state.error = true;
            console.log(action.payload)
        })
    }
})

export default balanceSlice.reducer