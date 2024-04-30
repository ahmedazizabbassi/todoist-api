import { NextFunction, Request, Response } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
    try {
        req.body.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : undefined;
    } catch (e: any) {
        req.body.dueDate = undefined;
    }
    next();
}