import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import Message from '../models/Message'

const router = express.Router()

// Get all messages
router.get('/', async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' })
  }
})

// Create a new message
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('email').trim().isEmail(),
    body('message').trim().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const message = new Message(req.body)
      await message.save()
      res.status(201).json(message)
    } catch (error) {
      res.status(500).json({ message: 'Error creating message' })
    }
  }
)

// Mark message as read
router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    )
    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }
    res.json(message)
  } catch (error) {
    res.status(500).json({ message: 'Error updating message' })
  }
})

// Delete a message
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id)
    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }
    res.json({ message: 'Message deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message' })
  }
})

export default router
