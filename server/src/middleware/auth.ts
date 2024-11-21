import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface AuthRequest extends Request {
  user?: {
    username: string
  }
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw new Error()
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { username: string }
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' })
  }
}