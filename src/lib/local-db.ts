import type { Tool, ToolDraft, Project, ProjectDraft, StackItem, StackLane } from '@/types'
import { DEFAULT_TOOLS } from './seed-data'
import { logger } from './logger'

const uid = () => crypto.randomUUID()
const now = () => new Date().toISOString()

function read<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

let seeded = false

export async function seedDefaults(userId: string) {
  const existing = read<Tool>('local_tools')
  const defaultMap = new Map(DEFAULT_TOOLS.map((t) => [t.name.toLowerCase(), t]))

  // Always migrate icons and categories for existing default tools
  let migrated = false
  const migratedTools = existing.map((t) => {
    const updated = { ...t }
    const defaultTool = defaultMap.get(t.name.toLowerCase())
    
    // If this tool matches a default tool, ensure it has the right fields
    if (defaultTool) {
      // Mark as default if not already
      if (!updated.isDefault) {
        updated.isDefault = true
        migrated = true
      }
      
      // Migrate category -> categories
      if (!updated.categories && (updated as any).category) {
        updated.categories = [(updated as any).category]
        migrated = true
      }
      if (!updated.categories) {
        updated.categories = ['other']
        migrated = true
      }
      
      // Update icon if it's empty or was a fallback letter
      if (!t.icon || t.icon.length <= 2) {
        updated.icon = defaultTool.icon
        migrated = true
      }
      
      // Update categories to match seed data if different
      if (defaultTool.categories && JSON.stringify(updated.categories) !== JSON.stringify(defaultTool.categories)) {
        updated.categories = defaultTool.categories
        migrated = true
      }
    }
    return updated
  })
  
  if (migrated) {
    write('local_tools', migratedTools)
    logger.info('SEED', `Migrated ${migratedTools.filter((t, i) => t !== existing[i]).length} tools`)
  }

  if (seeded) return

  const existingNames = new Set(migratedTools.map((t) => t.name.toLowerCase()))
  const toAdd: Tool[] = DEFAULT_TOOLS
    .filter((t) => !existingNames.has(t.name.toLowerCase()))
    .map((t) => ({ ...t, $id: uid(), $createdAt: now(), isDefault: true }))
  if (toAdd.length > 0) {
    write('local_tools', [...migratedTools, ...toAdd])
    logger.info('SEED', `Seeded ${toAdd.length} default tools for user ${userId}`)
  } else {
    logger.debug('SEED', 'No new defaults to seed')
  }
  seeded = true
}

// ─── Tools ───────────────────────────────────────────────────────────────────
export async function getTools(userId: string): Promise<Tool[]> {
  const all = read<Tool>('local_tools')
  const filtered = all.filter((t) => t.userId === userId || t.isPublic)
  logger.debug('DB', `getTools(${userId}) → ${filtered.length} tools`)
  return filtered
}

export async function createTool(userId: string, draft: ToolDraft): Promise<Tool> {
  const tool: Tool = {
    $id: uid(),
    $createdAt: now(),
    userId,
    name: draft.name,
    description: draft.description ?? '',
    categories: draft.categories ?? ['other'],
    url: draft.url ?? '',
    icon: draft.icon ?? '',
    color: draft.color ?? '#22c55e',
    tags: draft.tags ?? [],
    isPublic: draft.isPublic ?? false,
  }
  const all = read<Tool>('local_tools')
  all.push(tool)
  write('local_tools', all)
  logger.info('DB', `createTool: "${tool.name}" (${tool.$id})`)
  return tool
}

export async function updateTool(toolId: string, data: Partial<ToolDraft>): Promise<Tool> {
  const all = read<Tool>('local_tools')
  const idx = all.findIndex((t) => t.$id === toolId)
  if (idx === -1) throw new Error('Tool not found')
  all[idx] = { ...all[idx], ...data }
  if (data.tags) all[idx].tags = data.tags
  write('local_tools', all)
  logger.info('DB', `updateTool: "${all[idx].name}" (${toolId})`, data)
  return all[idx]
}

export async function deleteTool(toolId: string) {
  const all = read<Tool>('local_tools')
  const tool = all.find((t) => t.$id === toolId)
  write('local_tools', all.filter((t) => t.$id !== toolId))
  logger.info('DB', `deleteTool: "${tool?.name ?? toolId}" (${toolId})`)
}

// ─── Projects ────────────────────────────────────────────────────────────────
export async function getProjects(userId: string): Promise<Project[]> {
  const filtered = read<Project>('local_projects').filter((p) => p.userId === userId)
  logger.debug('DB', `getProjects(${userId}) → ${filtered.length} projects`)
  return filtered
}

export async function createProject(userId: string, draft: ProjectDraft): Promise<Project> {
  const project: Project = {
    $id: uid(),
    $createdAt: now(),
    userId,
    name: draft.name,
    description: draft.description ?? '',
    color: draft.color ?? '#22c55e',
    notes: draft.notes ?? '',
  }
  const all = read<Project>('local_projects')
  all.push(project)
  write('local_projects', all)
  logger.info('DB', `createProject: "${project.name}" (${project.$id})`)
  return project
}

export async function updateProject(projectId: string, data: Partial<ProjectDraft>): Promise<Project> {
  const all = read<Project>('local_projects')
  const idx = all.findIndex((p) => p.$id === projectId)
  if (idx === -1) throw new Error('Project not found')
  all[idx] = { ...all[idx], ...data }
  write('local_projects', all)
  logger.info('DB', `updateProject: "${all[idx].name}" (${projectId})`, data)
  return all[idx]
}

export async function deleteProject(projectId: string) {
  const all = read<Project>('local_projects')
  const project = all.find((p) => p.$id === projectId)
  write('local_projects', all.filter((p) => p.$id !== projectId))
  logger.info('DB', `deleteProject: "${project?.name ?? projectId}" (${projectId})`)
}

// ─── Stack items ─────────────────────────────────────────────────────────────
export async function getStackItems(projectId: string): Promise<StackItem[]> {
  const filtered = read<StackItem>('local_stack').filter((s) => s.projectId === projectId)
  logger.debug('DB', `getStackItems(${projectId}) → ${filtered.length} items`)
  return filtered
}

export async function addToStack(
  userId: string,
  projectId: string,
  toolId: string,
  lane: StackLane,
  order: number
): Promise<StackItem> {
  const item: StackItem = {
    $id: uid(),
    userId,
    projectId,
    toolId,
    lane,
    order,
  }
  const all = read<StackItem>('local_stack')
  all.push(item)
  write('local_stack', all)
  logger.info('DB', `addToStack: tool=${toolId} → lane=${lane} order=${order}`)
  return item
}

export async function updateStackItem(itemId: string, data: { lane?: StackLane; order?: number }) {
  const all = read<StackItem>('local_stack')
  const idx = all.findIndex((s) => s.$id === itemId)
  if (idx === -1) throw new Error('Stack item not found')
  all[idx] = { ...all[idx], ...data }
  write('local_stack', all)
  logger.info('DB', `updateStackItem: ${itemId}`, data)
  return all[idx]
}

export async function removeFromStack(itemId: string) {
  const all = read<StackItem>('local_stack')
  write('local_stack', all.filter((s) => s.$id !== itemId))
  logger.info('DB', `removeFromStack: ${itemId}`)
}
