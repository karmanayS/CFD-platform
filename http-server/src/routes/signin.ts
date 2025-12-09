import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {Resend} from "resend";
import "dotenv/config" 
import { redis } from "../redisClient";
import * as z from "zod"

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

const signinRouter = express.Router();

signinRouter.post("/", async(req,res) => {
    const {email} = req.body;
    const parsedEmail = z.email().safeParse(email)
    if (!parsedEmail.success) return res.json({success: false, message: "Invalid user input"})
    const token = jwt.sign({email: parsedEmail.data},process.env.JWT_SECRET as string);
    
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

        while (true) {
            const data = await redis.xRead({
                key: "EN-EX",
                id: lastId
            }, {
                BLOCK:0
            })
            if(data) {
                //@ts-ignore
                const message = data[0].messages[0].message;
                if (message.randomId !== randomId) continue;
                if (message.success === "false") return res.json({
                    success: false,
                    message : "Couldnt signin please try again"
                })
                break;
            } else {
                return res.json({
                    success: false,
                    message: "Did not receive signin status from stream"
                })
            } 
        }

        const {data,error} = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to : [email],
            subject: 'authentication',
            html: `<a href="http://localhost:3000/api/v1/signin/post?token=${token}> Signin </a>"`
        })
        if (error) return res.json({error})
        res.json({message:'email sent successfully'})
    } catch(err) {
        console.log(err)
        return res.json({
            success: false,
            message : "Error during Sign in"
        })
    }
})

signinRouter.get("/post",(req,res) => {
    const token = req.query.token;
    const decoded = jwt.verify(token as string,process.env.JWT_SECRET as string) as JwtPayload
    if (!decoded.email) return res.json({
        success: false,
        message : "Error while verifying user"
    })
    res.cookie("token", token)
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
})

export default signinRouter;