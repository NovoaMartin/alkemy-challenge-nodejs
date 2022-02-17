import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default async function validateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization') || '';
    const payload = jwt.verify(token, process.env.TOKEN_SECRET!) as { id : string };
    req.userId = payload.id;
    return next();
  } catch (e) {
    return res.status(401).json({ data: {}, err: { msg: 'Access denied' } });
  }
}
