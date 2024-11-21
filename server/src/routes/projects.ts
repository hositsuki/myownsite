import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import Project from '../models/Project'

const router = express.Router()

// Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' })
  }
})

// Get featured projects
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured projects' })
  }
})

// Create a new project
router.post(
  '/',
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('technologies').isArray({ min: 1 }),
    body('image').trim().notEmpty(),
    body('link').trim().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const project = new Project(req.body)
      await project.save()
      res.status(201).json(project)
    } catch (error) {
      res.status(500).json({ message: 'Error creating project' })
    }
  }
)

// Update a project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.json(project)
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' })
  }
})

// Delete a project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' })
  }
})

export default router
