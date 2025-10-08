import axios from "axios";
import { useEffect, useState } from "react"


export const UsdBalance = () => {
    const [balance,setBalance] = useState(0);

    useEffect(() => {
        async function getBalance() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/balance/usd?userId=user1`)
                const balance = parseFloat(response.data.usdBalance);
                setBalance(balance);
            } catch(err) {
                console.log(err);
                return
            }
        }
        getBalance()
    },[])

    return <div className="rounded p-2 text-lg bg-slate-600" >
        Balance: {balance.toFixed(2)}
    </div>
}