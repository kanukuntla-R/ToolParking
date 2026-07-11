import { DatabaseService } from '../services/database'
import { validateToolDraft, validateProjectDraft, validateStackItem } from '../validators'
import type { Tool, ToolDraft, Project, ProjectDraft, StackItem, StackLane } from '@/types'
import { logger } from '@/lib/logger'

export class ToolController {
  static async list(userId: string): Promise<Tool[]> {
    return await DatabaseService.getTools(userId)
  }

  static async create(userId: string, draft: ToolDraft): Promise<Tool> {
    const validation = validateToolDraft(draft)
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }
    
    return await DatabaseService.createTool(userId, draft)
  }

  static async update(toolId: string, userId: string, data: Partial<ToolDraft>): Promise<Tool> {
    const validation = validateToolDraft(data)
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }
    
    return await DatabaseService.updateTool(toolId, userId, data)
  }

  static async delete(toolId: string, userId: string): Promise<void> {
    return await DatabaseService.deleteTool(toolId, userId)
  }
}

export class ProjectController {
  static async list(userId: string): Promise<Project[]> {
    return await DatabaseService.getProjects(userId)
  }

  static async getById(projectId: string, userId: string): Promise<Project | null> {
    return await DatabaseService.getProjectById(projectId, userId)
  }

  static async create(userId: string, draft: ProjectDraft): Promise<Project> {
    const validation = validateProjectDraft(draft)
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }
    
    return await DatabaseService.createProject(userId, draft)
  }

  static async update(projectId: string, userId: string, data: Partial<ProjectDraft>): Promise<Project> {
    const validation = validateProjectDraft(data)
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }
    
    return await DatabaseService.updateProject(projectId, userId, data)
  }

  static async delete(projectId: string, userId: string): Promise<void> {
    return await DatabaseService.deleteProject(projectId, userId)
  }
}

export class StackController {
  static async list(projectId: string, userId: string): Promise<StackItem[]> {
    return await DatabaseService.getStackItems(projectId, userId)
  }

  static async add(
    userId: string,
    projectId: string,
    toolId: string,
    lane: StackLane,
    order: number
  ): Promise<StackItem> {
    const validation = validateStackItem({ projectId, toolId, lane, order })
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }
    
    return await DatabaseService.addToStack(userId, projectId, toolId, lane, order)
  }

  static async update(
    itemId: string,
    userId: string,
    data: { lane?: StackLane; order?: number }
  ): Promise<StackItem> {
    const validation = validateStackItem({ ...data })
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }
    
    return await DatabaseService.updateStackItem(itemId, userId, data)
  }

  static async remove(itemId: string, userId: string): Promise<void> {
    return await DatabaseService.removeFromStack(itemId, userId)
  }
}

export class DataController {
  static async clearAll(userId: string): Promise<void> {
    return await DatabaseService.clearAllData(userId)
  }
}
