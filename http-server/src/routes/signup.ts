import express from "express";
import jwt from "jsonwebtoken";
import {Resend} from "resend";
import "dotenv/config"; 
import * as z from "zod";
import { redis } from "../redisClient"

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

const signupRouter = express.Router();

signupRouter.post("/" , async(req,res) => {
    const {email} = req.body;
    const parsedEmail = z.email().safeParse(email)
    if (!parsedEmail.success) return res.json({
        success : false,
        message: "Invalid user input"
    })
    const token = jwt.sign({email: parsedEmail.data},process.env.JWT_SECRET as string);
    
    // create a user in engine and give it default balance of 5k
    try {
        const response = await redis.xRevRange('EN-EX', '+', '-', {COUNT: 1});
        let lastId;
        if (response.length === 0) {
            lastId = "0"
        } else {
            lastId = response[0].id
        }

        const randomId = crypto.randomUUID()
        await redis.xAdd("EX-EN", "*", {
            randomId,
            type: "signUp",
            payload: JSON.stringify({
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
                    message : "Couldnt signup please try again"
                })
                break;
            } else {
                return res.json({
                    success: false,
                    message: "Did not receive signup status from stream"
                })
            } 
            
        }

        const {data,error} = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to : [email],
            subject: 'authentication',
            html: `<a href="http://localhost:3000/api/v1/signin/post?token=${token}> Signin </a>"`
            })
        if (error) return res.json({
            success: false,
            message: "Error sending email"
        })
        res.json({
            success : true,
            message:'Email sent successfully'
        })
    } catch (err) {
        console.log(err)
        return res.json({
            success: false,
            message: "Error during signup"
        })
    }
})

export default signupRouter;
