import express from "express";
import cors from "cors";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import tradeRouter from "./routes/trade";
import { balanceRouter } from "./routes/balance";
import assetRouter from "./routes/supportedAssets";
import { orderRouter } from "./routes/orders";
import { klineRouter } from "./routes/klineRouter";
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())
app.use("/api/v1/signup", signupRouter);
app.use("/api/v1/signin",signinRouter);
app.use("/api/v1/trade",tradeRouter);
app.use("/api/v1/balance",balanceRouter);
app.use("/api/v1/supportedAssets",assetRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/klines",klineRouter)

app.listen(3000,() => {
    console.log("listening on port 3000 ...")
});
