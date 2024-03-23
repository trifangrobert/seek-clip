import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
    userId?: string;
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        // remove quotes from token if present
        if (token?.startsWith('"') && token?.endsWith('"')) {
            token = token.slice(1, -1);
        }
        console.log("Middleware token check", token);
        if (!token) {
            return res.status(401).json({ error: "Authentication token not provided!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userId = (decoded as any)._id;
        next();
    }
    catch (error) {
        console.log("error from authenticate middleware: ", error);
        return res.status(401).json({ error: "Unauthorized!" });
    }
}

export default authenticate;