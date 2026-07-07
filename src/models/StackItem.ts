import mongoose, { Schema, Document } from 'mongoose'

export interface IStackItem extends Document {
  userId: string
  projectId: string
  toolId: string
  lane: string
  order: number
  createdAt: Date
  updatedAt: Date
}

const StackItemSchema = new Schema<IStackItem>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    toolId: {
      type: String,
      required: true,
      index: true,
    },
    lane: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Auth', 'Other'],
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index for efficient queries
StackItemSchema.index({ projectId: 1, order: 1 })
StackItemSchema.index({ userId: 1, projectId: 1 })

// Prevent model overwrite in development
export const StackItem = mongoose.models.StackItem || mongoose.model<IStackItem>('StackItem', StackItemSchema)
