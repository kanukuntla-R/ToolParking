import type { ToolCategory } from '@/types'

export const VALID_CATEGORIES: ToolCategory[] = [
  'frontend', 'backend', 'database', 'devops', 
  'auth', 'ui', 'testing', 'monitoring', 'skills', 'tools', 'open-source', 'other'
]

export const VALID_LANES = [
  'Frontend', 'Backend', 'Database', 'DevOps', 'Auth', 'Other'
] as const

export function validateToolDraft(data: any, options: { partial?: boolean } = {}): { valid: boolean; errors: string[] } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: ['Request body must be an object'] }
  }

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
  
  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push('Description must be a string')
  } else if (data.description && data.description.length > 500) {
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
  
  if (data.url !== undefined && typeof data.url !== 'string') {
    errors.push('URL must be a string')
  } else if (data.url) {
    try {
      const url = new URL(data.url)
      if (!['http:', 'https:'].includes(url.protocol)) errors.push('URL must use http or https')
    } catch {
      errors.push('Invalid URL format')
    }
  }
  
  if (data.color !== undefined && (typeof data.color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(data.color))) {
    errors.push('Invalid color format (must be hex like #22c55e)')
  }
  
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag: unknown) => typeof tag !== 'string'))) {
    errors.push('Tags must be an array of strings')
  }

  if (data.icon !== undefined && typeof data.icon !== 'string') errors.push('Icon must be a string')
  if (data.isPublic !== undefined && typeof data.isPublic !== 'boolean') errors.push('isPublic must be a boolean')
  
  return { valid: errors.length === 0, errors }
}

export function validateProjectDraft(data: any, options: { partial?: boolean } = {}): { valid: boolean; errors: string[] } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: ['Request body must be an object'] }
  }

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
  
  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push('Description must be a string')
  } else if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters')
  }
  
  if (data.color !== undefined && (typeof data.color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(data.color))) {
    errors.push('Invalid color format')
  }
  
  if (data.notes !== undefined && typeof data.notes !== 'string') {
    errors.push('Notes must be a string')
  } else if (data.notes && data.notes.length > 50000) {
    errors.push('Notes too long (max 50000 characters)')
  }
  
  return { valid: errors.length === 0, errors }
}

export function validateStackItem(data: any, options: { partial?: boolean } = {}): { valid: boolean; errors: string[] } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: ['Request body must be an object'] }
  }

  const errors: string[] = []
  
  if (!options.partial && (typeof data.projectId !== 'string' || !data.projectId)) errors.push('Project ID is required')
  if (!options.partial && (typeof data.toolId !== 'string' || !data.toolId)) errors.push('Tool ID is required')
  if ((!options.partial || data.lane !== undefined) && (!data.lane || !VALID_LANES.includes(data.lane))) {
    errors.push(`Invalid lane. Must be one of: ${VALID_LANES.join(', ')}`)
  }
  if ((!options.partial || data.order !== undefined) && (!Number.isInteger(data.order) || data.order < 0)) {
    errors.push('Order must be a non-negative integer')
  }
  
  return { valid: errors.length === 0, errors }
}
