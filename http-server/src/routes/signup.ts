import express from "express";
import jwt, { sign } from "jsonwebtoken";
import {Resend} from "resend";
import dotenv from 'dotenv'

dotenv.config();
const resend = new Resend('re_YreQn8zr_5sdNtwT8vK8bX1PY2kQBG8rL');

const signupRouter = express.Router();

signupRouter.post("/" , async(req,res) => {
    const {email} = req.body;
    const token = jwt.sign({email},process.env.JWT_SECRET as string);
    
    const {data,error} = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to : [email],
        subject: 'authentication',
        html: `<a href="http://localhost:3000/api/v1/signin/post?token=${token}> Signin </a>"`
    })
    if (error) return res.json({error})
    res.json({message:'email sent successfully'})
})

export default signupRouter;
