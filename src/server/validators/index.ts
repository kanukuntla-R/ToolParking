import type { ToolCategory } from '@/types'

export const VALID_CATEGORIES: ToolCategory[] = [
  'frontend', 'backend', 'database', 'devops', 
  'auth', 'ui', 'testing', 'monitoring', 'skills', 'tools', 'open-source', 'other'
]

export const VALID_LANES = [
  'Frontend', 'Backend', 'Database', 'DevOps', 'Auth', 'Other'
] as const

export function validateToolDraft(data: any, options: { partial?: boolean } = {}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!options.partial && (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0)) {
    errors.push('Name is required')
  }

  if (options.partial && data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
    errors.push('Name cannot be blank')
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters')
  }
  
  if (data.categories && (!Array.isArray(data.categories) || data.categories.length === 0)) {
    errors.push('At least one category is required')
  }
  
  if (data.categories && Array.isArray(data.categories)) {
    const invalidCats = data.categories.filter((c: string) => !VALID_CATEGORIES.includes(c as ToolCategory))
    if (invalidCats.length > 0) {
      errors.push(`Invalid categories: ${invalidCats.join(', ')}`)
    }
  }
  
  if (data.url && typeof data.url === 'string') {
    try {
      new URL(data.url)
    } catch {
      errors.push('Invalid URL format')
    }
  }
  
  if (data.color && typeof data.color === 'string' && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
    errors.push('Invalid color format (must be hex like #22c55e)')
  }
  
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array')
  }
  
  return { valid: errors.length === 0, errors }
}

export function validateProjectDraft(data: any, options: { partial?: boolean } = {}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!options.partial && (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0)) {
    errors.push('Name is required')
  }

  if (options.partial && data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
    errors.push('Name cannot be blank')
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters')
  }
  
  if (data.color && typeof data.color === 'string' && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
    errors.push('Invalid color format')
  }
  
  if (data.notes && data.notes.length > 50000) {
    errors.push('Notes too long (max 50000 characters)')
  }
  
  return { valid: errors.length === 0, errors }
}

export function validateStackItem(data: any, options: { partial?: boolean } = {}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!options.partial && !data.projectId) errors.push('Project ID is required')
  if (!options.partial && !data.toolId) errors.push('Tool ID is required')
  if ((!options.partial || data.lane !== undefined) && (!data.lane || !VALID_LANES.includes(data.lane))) {
    errors.push(`Invalid lane. Must be one of: ${VALID_LANES.join(', ')}`)
  }
  if ((!options.partial || data.order !== undefined) && (typeof data.order !== 'number' || data.order < 0)) {
    errors.push('Order must be a non-negative number')
  }
  
  return { valid: errors.length === 0, errors }
}
