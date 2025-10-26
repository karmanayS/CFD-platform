import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { fetchBalance } from "../redux/slices/balanceSlice"


export const UsdBalance = () => {
    // const [balance,setBalance] = useState(0);
    const {value,loading,error} = useSelector((state:RootState) => state.balance)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchBalance())
    },[])

    if (loading) <div> Loading... </div>
    else if (error) <div> Error </div>
    else {
        return <div className="rounded p-2 text-lg bg-slate-600" >
            Balance: {value.toFixed(2)}
        </div>
    }
}