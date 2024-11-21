import mongoose from 'mongoose'

export interface IMessage {
  name: string
  email: string
  message: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.model<IMessage>('Message', messageSchema)
