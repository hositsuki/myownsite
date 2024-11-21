import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Admin login
router.post(
  '/login',
  [
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, password } = req.body

    // In a real application, you would validate against a database
    // For demo purposes, we'll use hardcoded credentials
    const validUsername = 'admin'
    const validPasswordHash = '$2a$10$your-hashed-password' // You should hash your password

    try {
      if (username !== validUsername) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const isValidPassword = await bcrypt.compare(password, validPasswordHash)
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' })
      res.json({ token })
    } catch (error) {
      res.status(500).json({ message: 'Error during authentication' })
    }
  }
)

export default router
