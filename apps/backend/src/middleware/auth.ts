import { Request, Response, NextFunction } from "express";
import jwt  from "jsonwebtoken"
import "dotenv/config";
import { prisma } from "@n8n-v0/db";

const JWT_SECRET = process.env.JWT_SECRET || "vasanth";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Requested URL:", req.url);
    const token = req.cookies.jwt;
    
    if (!token) {
        return res.status(401).json({ msg: "Not Auhenticated"});
    };

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({ msg: " user not found "});
        }

        req.user = { id: decoded.id, email: decoded.email };

        next();
    } catch (error) {
        res.status(403).json({ msg: "invalid token"})
    }
}