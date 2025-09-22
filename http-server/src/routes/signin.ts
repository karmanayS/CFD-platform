import express from "express";
import jwt from "jsonwebtoken";
import {Resend} from "resend";
import dotenv from 'dotenv'

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY ?? "");

const signinRouter = express.Router();

signinRouter.post("/", async(req,res) => {
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

signinRouter.get("/post/:token",(req,res) => {
    const token = req.query.token;
    const decoded = jwt.verify(token as string,process.env.JWT_SECRET as string)
    if (decoded) {
        res.cookie("token",token);
        res.redirect("url for frontend")
    } else {
        res.json({message: "error"})
    }
})

export default signinRouter;