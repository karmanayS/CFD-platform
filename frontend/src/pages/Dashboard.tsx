import { useState} from "react"
import { PlaceOrder } from "../components/PlaceOrder"
import { SupportedAssets } from "../components/SupportedAssets";
import { usePriceFeed } from "../hooks/usePriceFeed";

export const Dashboard = () => {
    const [asset,setAsset] = useState("BTC");
    const assetPrices = usePriceFeed();    
    
    return <div className="flex flex-col h-screen p-2">
        <div className="p-4 w-full mb-4 text-center border" > NAVBAR </div>

        <div className="flex flex-row w-full mb-4" >
            <div className="w-80 border mr-2" > <SupportedAssets assetPrices={assetPrices} /> </div>

            <div className=" flex flex-col flex-1 border mr-2 p-2" > 
               <div className="mb-4" >
                    <form className="w-36">
                        <select onChange={(e) => setAsset(e.target.value)} defaultValue="BTC" className="block w-full focus:outline-none">
                            <option value="BTC">Bitcoin</option>
                            <option value="SOL">Solana</option>
                        </select>
                    </form>
               </div>
               <div> CHART </div>  
            </div>

            <div className="w-60" > <PlaceOrder assetPrices={assetPrices} asset={asset} /> </div>
        </div>

        <div className="border" > ORDERS </div>
    </div>
}