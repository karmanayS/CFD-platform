import express from "express";
import cors from "cors";
import signupRouter from "./routes/signup";
import signinRouter from "./routes/signin";
import tradeRouter from "./routes/trade";

const app = express()

app.use(cors())
app.use(express.json());
app.use("/api/v1/signup", signupRouter);
app.use("/api/v1/signin",signinRouter);
app.use("/api/v1/trade",tradeRouter)

app.listen(3000,() => {
    console.log("listening on port 3000 ...")
});
