// Frontend API client - uses Next.js API routes
import { apiClient } from './api'
import type { Tool, ToolDraft, Project, ProjectDraft, StackItem, StackLane } from '@/types'
import { logger } from './logger'

// ─── Tools ───────────────────────────────────────────────────────────────────
export async function getTools(userId: string): Promise<Tool[]> {
  const tools = await apiClient.getTools()
  logger.debug('DB', `getTools(${userId}) → ${tools.length} tools`)
  return tools
}

export async function createTool(userId: string, draft: ToolDraft): Promise<Tool> {
  const tool = await apiClient.createTool(draft)
  logger.info('DB', `createTool: "${tool.name}" (${tool.$id})`)
  return tool
}

export async function updateTool(toolId: string, data: Partial<ToolDraft>): Promise<Tool> {
  const tool = await apiClient.updateTool(toolId, data)
  logger.info('DB', `updateTool: "${tool.name}" (${toolId})`)
  return tool
}

export async function deleteTool(toolId: string): Promise<void> {
  await apiClient.deleteTool(toolId)
  logger.info('DB', `deleteTool: ${toolId}`)
}

// ─── Projects ────────────────────────────────────────────────────────────────
export async function getProjects(userId: string): Promise<Project[]> {
  const projects = await apiClient.getProjects()
  logger.debug('DB', `getProjects(${userId}) → ${projects.length} projects`)
  return projects
}

export async function createProject(userId: string, draft: ProjectDraft): Promise<Project> {
  const project = await apiClient.createProject(draft)
  logger.info('DB', `createProject: "${project.name}" (${project.$id})`)
  return project
}

export async function updateProject(projectId: string, data: Partial<ProjectDraft>): Promise<Project> {
  const project = await apiClient.updateProject(projectId, data)
  logger.info('DB', `updateProject: "${project.name}" (${projectId})`)
  return project
}

export async function deleteProject(projectId: string): Promise<void> {
  await apiClient.deleteProject(projectId)
  logger.info('DB', `deleteProject: ${projectId}`)
}

// ─── Stack items ─────────────────────────────────────────────────────────────
export async function getStackItems(projectId: string): Promise<StackItem[]> {
  const items = await apiClient.getStackItems(projectId)
  logger.debug('DB', `getStackItems(${projectId}) → ${items.length} items`)
  return items
}

export async function addToStack(
  userId: string,
  projectId: string,
  toolId: string,
  lane: StackLane,
  order: number
): Promise<StackItem> {
  const item = await apiClient.addToStack(projectId, toolId, lane, order)
  logger.info('DB', `addToStack: tool=${toolId} → lane=${lane} order=${order}`)
  return item
}

export async function updateStackItem(itemId: string, data: { lane?: StackLane; order?: number }): Promise<StackItem> {
  const item = await apiClient.updateStackItem(itemId, data)
  logger.info('DB', `updateStackItem: ${itemId}`)
  return item
}

export async function removeFromStack(itemId: string): Promise<void> {
  await apiClient.removeFromStack(itemId)
  logger.info('DB', `removeFromStack: ${itemId}`)
}
