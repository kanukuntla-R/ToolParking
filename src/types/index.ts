// ─── Tool ────────────────────────────────────────────────────────────────────
export type ToolCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'auth'
  | 'ui'
  | 'testing'
  | 'monitoring'
  | 'skills'
  | 'tools'
  | 'open-source'
  | 'other'

export interface Tool {
  $id: string
  $createdAt: string
  name: string
  description: string
  categories: ToolCategory[]
  url: string
  icon: string          // emoji or short symbol
  color: string         // hex, used for icon bg tint
  tags: string[]
  userId: string
  isPublic: boolean
  isDefault?: boolean   // true for seeded default tools
}

export type ToolDraft = Omit<Tool, '$id' | '$createdAt' | 'userId'>

// ─── Project ─────────────────────────────────────────────────────────────────
export interface Project {
  $id: string
  $createdAt: string
  name: string
  description: string
  userId: string
  color: string
  notes?: string  // markdown notes
}

export type ProjectDraft = Omit<Project, '$id' | '$createdAt' | 'userId'>

// ─── Stack item (tool assigned to a project) ─────────────────────────────────
export type StackLane = 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Auth' | 'Other'

export interface StackItem {
  $id: string
  projectId: string
  toolId: string
  lane: StackLane
  order: number
  userId: string
  // hydrated client-side
  tool?: Tool
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AppUser {
  $id: string
  name: string
  email: string
}
