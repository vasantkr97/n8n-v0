import { prisma } from "@n8n/db";
import { Request, Response } from "express";
import { CredentialsSchema } from "@n8n/validator";

export interface AuthRequest extends Request {
    user?: {
        id: string,
        email: string,
    }
}

export const postCredentials = async (req: AuthRequest, res:Response) => {
    try {
        const response = CredentialsSchema.safeParse(req.body);

        if (!response.success) {
            return res.status(400).json({ msg: "Zod validation Failed"})
        }
        const { title, platform, data } = response.data
        const userId = req.user?.id
        if (!userId) {
            return res.status(400).json({ msg: "userId required"});
        };
        const credentials = await prisma.credentials.create({
            data: {
                title: title,
                platform,
                data: data,
                userId: userId
            }
        });

        return res.status(201).json({
            msg:"Credentials created Successfully",
            credentials: credentials,
        })

    } catch (error) {
        console.log("Error creating credentials:", error);

        return res.status(500).json({ msg: "internal Server Error"})
    }
};

export const getCredentials = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if(!userId) {
            return res.status(400).json({ msg: "user not found"});
        }

        const credentials = await prisma.credentials.findMany({
            where: {
                userId,
            }
        })
        return res.json({ msg: "credentials:", credentials})
    } catch (error) {
        console.error("no credentials found!", error);
        res.status(500).json({ msg: "Internal server Error"});
    }
};

export const updateCredentials = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { CredId }= req.params;
        console.log("Params:", req.params);
        const { title, platform, data } = req.body;

        if (!userId) {
            return res.status(400).json({ msg: "user not authenticated"});
        }
        
        if (!CredId) {
            return res.status(400).json({ msg: "Credentials ID is required"});
        }

        const exisiting = await prisma.credentials.findFirst({
            where: {
                id: CredId, 
                userId
            }
        });

        if (!exisiting) {
            return res.status(404).json({ msg: "credentials not found or not owned by user"})
        };

        const updated = await prisma.credentials.update({
            where: { 
                id: CredId
            },
            data: {
                title: title ?? exisiting.title,
                platform: platform ?? exisiting.platform,
                data: data ?? exisiting.data
            }
        })

        res.status(200).json({
            msg: "updated successfully",
            credentials: updated
        })
    } catch (error) {
        console.error("Error updating credentials", error);
        return res.status(500).json({ error: "Internal server error"})
    }
};

export const deleteCredentials = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const { id } = req.params;

        if (!userId) {
            return res.status(400).json({ msg: "user not authenticated to delete"});
        }

        const credentials = await prisma.credentials.delete({
            where: {
                id: id,
            }
        })

        return res.status(200).json({
            msg: "Credentials were successfully deleted",
            credentials
        })
    } catch (error) {
        console.error("Error deleting Credentials", error);
        return res.status(500).json({ error: "internal Server Error"})
    }
}