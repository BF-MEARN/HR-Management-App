import jwt from 'jsonwebtoken';
import validator from 'validator';
import { Request, Response, NextFunction } from 'express';

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized (No Token)' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof decoded !== 'object' || !decoded.id || !validator.isMongoId(decoded.id)) {
            return res.status(401).json({ message: 'Unauthorized (Invalid Token)' });
        }
    } catch (error: unknown) {
        return res.status(401).json(error);
    }

    next();
}