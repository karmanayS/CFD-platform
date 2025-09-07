import express from "express";

const balanceRouter = express.Router();

balanceRouter.get("/balance",(req,res) => {
    const {userId} = req.body;
    //send userId through streams
    //subscribe to pubsub to get balance 
})

export default balanceRouter;