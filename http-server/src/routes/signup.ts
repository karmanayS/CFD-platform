import express from "express";
import jwt from "jsonwebtoken";
import {Resend} from "resend";
import "dotenv/config"; 
import * as z from "zod";
import { redis } from "../redisClient"
import { streamReader } from "../helpers/streamReader";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export const signupRouter = express.Router();

signupRouter.post("/" , async(req,res) => {
    const {email} = req.body;
    const parsedEmail = z.email().safeParse(email)
    if (!parsedEmail.success) return res.status(400).json({
        success : false,
        message: "Invalid user input"
    })
    const token = jwt.sign({email: parsedEmail.data},process.env.JWT_SECRET as string, { expiresIn: "7d" });
    
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
        const message = await streamReader(lastId,randomId)
        console.log(message)
        if (message.message.success === "false") return res.status(400).json({
            success: false,
            message : "Couldnt signup please try again or login"
        })
        const {data,error} = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to : [email],
            subject: 'authentication',
            html: `<a href="${process.env.API_BASE_URL}/api/v1/signin/post?token=${token}"> Signin </a>`
            })
        if (error) return res.status(500).json({
            success: false,
            message: "Error sending email"
        })
        res.json({
            success : true,
            message:'Email sent successfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Error during signup"
        })
    }
})
