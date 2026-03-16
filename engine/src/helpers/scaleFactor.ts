import { PRICES } from "../db"

export const scaleFactor = (asset:string) => {
    const decimal = PRICES.find(a => a.asset === asset)?.decimal
    return 10 ** (decimal as number)
}