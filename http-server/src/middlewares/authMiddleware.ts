import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authMiddleware(req:Request,res:Response,next:NextFunction) {
    const {token} = req.cookies;
    if (!token) return res.status(401).json({
        success: false,
        message: "Empty token"
    })
    try {
        const decoded = jwt.verify(token as string,process.env.JWT_SECRET as string) as JwtPayload
        if (!decoded.email) return res.status(401).json({
            success : false,
            message : "Invalid auth token"
        })
        req.userId = decoded.email
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            success : false,
            message : "Invalid or expired auth token"
        })
    }    
}