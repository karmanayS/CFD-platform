import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {Resend} from "resend";
import "dotenv/config" 
import { redis } from "../redisClient";
import * as z from "zod"
import { streamReader } from "../helpers/streamReader";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export const signinRouter = express.Router();

signinRouter.post("/", async(req,res) => {
    const {email} = req.body;
    const parsedEmail = z.email().safeParse(email)
    if (!parsedEmail.success) return res.status(400).json({success: false, message: "Invalid user input"})
    const token = jwt.sign({email: parsedEmail.data},process.env.JWT_SECRET as string, { expiresIn: "7d" });
    
    // check for user in engine
    try {
        const response = await redis.xRevRange('EN-EX', '+', '-', {COUNT: 1});
        let lastId;
        if (response.length === 0) {
            lastId = "0"
        } else {
            lastId = response[0].id
        }

        const randomId = crypto.randomUUID()
        await redis.xAdd("EX-EN", "*" , {
            randomId,
            type : "signIn",
            payload : JSON.stringify({
                email
            })    
        })
        const message = await streamReader(lastId,randomId)
        console.log(message)
        if (message.message.success === "false") return res.status(400).json({
            success: false,
            message : "Couldn't signin please try again"
        })
        const {data,error} = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to : [email],
            subject: 'authentication',
            html: `<a href="${process.env.API_BASE_URL}/api/v1/signin/post?token=${token}"> Signin </a>`
        })
        if (error) return res.status(500).json({success: false,message: "Error while sending email"})
        res.json({success: true,message:'email sent successfully'})
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message : "Error during Sign in"
        })
    }
})

signinRouter.get("/post",(req,res) => {
    try {
        const token = req.query.token;
        const decoded = jwt.verify(token as string,process.env.JWT_SECRET as string) as JwtPayload
        if (!decoded.email) return res.status(401).json({
            success: false,
            message : "Invalid or expired auth token"
        })
        res.cookie("token", token)
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
    } catch(err) {
        console.log(err)
        res.status(401).json({
            success: false,
            message: "Invalid or expired auth token"
        })
    }    
})