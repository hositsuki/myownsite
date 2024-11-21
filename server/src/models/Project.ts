import mongoose from 'mongoose'

export interface IProject {
  title: string
  description: string
  technologies: string[]
  image: string
  link: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.model<IProject>('Project', projectSchema)
