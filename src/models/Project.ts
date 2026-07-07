import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
  userId: string
  name: string
  description: string
  color: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
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
    color: {
      type: String,
      default: '#22c55e',
      match: /^#[0-9A-Fa-f]{6}$/,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 50000,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent model overwrite in development
export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
