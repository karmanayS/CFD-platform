// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";

// export function authMiddlware(req:Request,res:Response,next:NextFunction) {
//     const token  = req.cookies;
//     const decoded = jwt.verify(token,process.env.JWT_SECRET as string)
//     if (decoded) {
//         req.user
//     } else return console.error("Error verifying jwt")
// }