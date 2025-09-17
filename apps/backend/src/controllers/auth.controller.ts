import { prisma } from "@n8n/db"
import { Request, Response } from "express"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

type AuthRequest = Request & {
    user?: { id: string; email: string }
}

const JWT_SECRET = process.env.JWT_SECRET || "vasanth";

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;

        const exists = await prisma.user.findUnique({
            where: { email }
        });

        if (exists) {
            return res.status(400).json({ msg: "User already exists"})
            
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, username }
        });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            maxAge: 7*24*60*60*1000
        })

        res.json({
            message: "user created successfully",
            user: { id: user.id, email: user.email, token: token }
        })
    } catch(error) {
        res.status(500).json({ msg: "error in signingUp"})
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "email and password required"});
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({ msg: "Ivalid credentials"})
        };

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ msg: "Invalid password"});
        }

        const token = jwt.sign({ id: user.id, email: user.email}, JWT_SECRET);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            maxAge: 7*24*60*60*1000
        })

        res.json({
            message: "login successfull",
            user: { id: user.id, email: user.email},
            token: token
        })
    } catch(error) {
        res.status(500).json({
            msg: "error in signing in"
        })
    }

};

export const signout = async (req: Request, res: Response) => {
    res.clearCookie('jwt')
    res.json({ message: "loggout out successfully"})
};

export const profile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id},
            select: { id: true, email: true}
        })

        res.json({ user })
    } catch(err) {
        res.status(500).json({ msg: "error while getting profile"})
    }
};

export const me = async (req: AuthRequest, res: Response) => {
    res.json({
        authentication: true,
        user: req.user
    })
}