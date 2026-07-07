import mongoose, { Schema, Document } from 'mongoose'

export interface ITool extends Document {
  userId: string
  name: string
  description: string
  categories: string[]
  url: string
  icon: string
  color: string
  tags: string[]
  isPublic: boolean
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

const ToolSchema = new Schema<ITool>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    categories: {
      type: [String],
      default: ['other'],
      enum: ['frontend', 'backend', 'database', 'devops', 'auth', 'ui', 'testing', 'monitoring', 'other'],
    },
    url: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#22c55e',
      match: /^#[0-9A-Fa-f]{6}$/,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index for efficient queries
ToolSchema.index({ userId: 1, isPublic: 1 })
ToolSchema.index({ name: 'text', description: 'text', tags: 'text' })

// Prevent model overwrite in development
export const Tool = mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema)
