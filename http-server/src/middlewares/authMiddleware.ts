import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authMiddlware(req:Request,res:Response,next:NextFunction) {
    const {token} = req.cookies;
    try {
        const decoded = jwt.verify(token as string,process.env.JWT_SECRET as string) as JwtPayload
        if (!decoded.email) return res.json({
            success : false,
            message : "Invalid auth token"
        })
        req.userId = decoded.email
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success : false,
            messsage : "Error while authenticating user"
        })
    }    
}