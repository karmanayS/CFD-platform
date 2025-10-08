import { UsdBalance } from "./UsdBalance"

export const Navbar = () => {
    return <div className="flex justify-between p-4 w-full mb-4 text-center border" > 
        <div>CFD</div>
        <UsdBalance />
    </div>
}