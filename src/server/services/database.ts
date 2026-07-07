import type { Tool, ToolDraft, Project, ProjectDraft, StackItem, StackLane } from '@/types'
import { DEFAULT_TOOLS } from '@/lib/seed-data'
import { logger } from '@/lib/logger'
import { connectToDatabase } from '@/lib/mongodb'
import { Tool as ToolModel, Project as ProjectModel, StackItem as StackItemModel } from '@/models'

let seeded = false

export class DatabaseService {
  // ─── Seed Management ─────────────────────────────────────────────────────
  static async seedDefaults(userId: string): Promise<void> {
    await connectToDatabase()
    
    if (seeded) return
    
    // Check if user already has tools
    const existingCount = await ToolModel.countDocuments({ userId })
    
    if (existingCount > 0) {
      logger.info('SEED', `User ${userId} already has ${existingCount} tools, skipping seed`)
      seeded = true
      return
    }
    
    // Create default tools for the user
    const toolsToCreate = DEFAULT_TOOLS.map((tool) => ({
      ...tool,
      userId,
      isDefault: true,
    }))
    
    await ToolModel.insertMany(toolsToCreate)
    logger.info('SEED', `Seeded ${toolsToCreate.length} default tools for user ${userId}`)
    seeded = true
  }

  // ─── Tools ───────────────────────────────────────────────────────────────
  static async getTools(userId: string): Promise<Tool[]> {
    await connectToDatabase()
    
    const tools = await ToolModel.find({
      $or: [
        { userId },
        { isPublic: true }
      ]
    }).sort({ createdAt: -1 })
    
    logger.debug('DB', `getTools(${userId}) → ${tools.length} tools`)
    return tools.map(this.mapTool)
  }

  static async getToolById(toolId: string): Promise<Tool | null> {
    await connectToDatabase()
    
    const tool = await ToolModel.findById(toolId)
    return tool ? this.mapTool(tool) : null
  }

  static async createTool(userId: string, draft: ToolDraft): Promise<Tool> {
    await connectToDatabase()
    
    const tool = await ToolModel.create({
      userId,
      name: draft.name.trim(),
      description: draft.description?.trim() ?? '',
      categories: draft.categories ?? ['other'],
      url: draft.url?.trim() ?? '',
      icon: draft.icon ?? '',
      color: draft.color ?? '#22c55e',
      tags: draft.tags ?? [],
      isPublic: draft.isPublic ?? false,
      isDefault: false,
    })
    
    logger.info('DB', `createTool: "${tool.name}" (${tool._id})`)
    return this.mapTool(tool)
  }

  static async updateTool(toolId: string, userId: string, data: Partial<ToolDraft>): Promise<Tool> {
    await connectToDatabase()
    
    const tool = await ToolModel.findOneAndUpdate(
      { _id: toolId, userId },
      {
        ...(data.name && { name: data.name.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.categories && { categories: data.categories }),
        ...(data.url !== undefined && { url: data.url.trim() }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.color && { color: data.color }),
        ...(data.tags && { tags: data.tags }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
      { new: true }
    )
    
    if (!tool) throw new Error('Tool not found or unauthorized')
    
    logger.info('DB', `updateTool: "${tool.name}" (${toolId})`)
    return this.mapTool(tool)
  }

  static async deleteTool(toolId: string, userId: string): Promise<void> {
    await connectToDatabase()
    
    const result = await ToolModel.deleteOne({ _id: toolId, userId })
    
    if (result.deletedCount === 0) {
      throw new Error('Tool not found or unauthorized')
    }
    
    logger.info('DB', `deleteTool: ${toolId}`)
  }

  // ─── Projects ────────────────────────────────────────────────────────────
  static async getProjects(userId: string): Promise<Project[]> {
    await connectToDatabase()
    
    const projects = await ProjectModel.find({ userId }).sort({ createdAt: -1 })
    logger.debug('DB', `getProjects(${userId}) → ${projects.length} projects`)
    return projects.map(this.mapProject)
  }

  static async getProjectById(projectId: string, userId: string): Promise<Project | null> {
    await connectToDatabase()
    
    const project = await ProjectModel.findOne({ _id: projectId, userId })
    return project ? this.mapProject(project) : null
  }

  static async createProject(userId: string, draft: ProjectDraft): Promise<Project> {
    await connectToDatabase()
    
    const project = await ProjectModel.create({
      userId,
      name: draft.name.trim(),
      description: draft.description?.trim() ?? '',
      color: draft.color ?? '#22c55e',
      notes: draft.notes ?? '',
    })
    
    logger.info('DB', `createProject: "${project.name}" (${project._id})`)
    return this.mapProject(project)
  }

  static async updateProject(projectId: string, userId: string, data: Partial<ProjectDraft>): Promise<Project> {
    await connectToDatabase()
    
    const project = await ProjectModel.findOneAndUpdate(
      { _id: projectId, userId },
      {
        ...(data.name && { name: data.name.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.color && { color: data.color }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      { new: true }
    )
    
    if (!project) throw new Error('Project not found or unauthorized')
    
    logger.info('DB', `updateProject: "${project.name}" (${projectId})`)
    return this.mapProject(project)
  }

  static async deleteProject(projectId: string, userId: string): Promise<void> {
    await connectToDatabase()
    
    // Delete project
    const projectResult = await ProjectModel.deleteOne({ _id: projectId, userId })
    if (projectResult.deletedCount === 0) {
      throw new Error('Project not found or unauthorized')
    }
    
    // Delete associated stack items
    await StackItemModel.deleteMany({ projectId })
    
    logger.info('DB', `deleteProject: ${projectId}`)
  }

  // ─── Stack Items ─────────────────────────────────────────────────────────
  static async getStackItems(projectId: string, userId: string): Promise<StackItem[]> {
    await connectToDatabase()
    
    // Verify project ownership
    const project = await ProjectModel.findOne({ _id: projectId, userId })
    if (!project) throw new Error('Project not found or unauthorized')
    
    const items = await StackItemModel.find({ projectId })
      .sort({ order: 1 })
    
    logger.debug('DB', `getStackItems(${projectId}) → ${items.length} items`)
    return items.map(this.mapStackItem)
  }

  static async addToStack(
    userId: string,
    projectId: string,
    toolId: string,
    lane: StackLane,
    order: number
  ): Promise<StackItem> {
    await connectToDatabase()
    
    // Verify project ownership
    const project = await ProjectModel.findOne({ _id: projectId, userId })
    if (!project) throw new Error('Project not found or unauthorized')
    
    // Verify tool exists
    const tool = await ToolModel.findById(toolId)
    if (!tool) throw new Error('Tool not found')
    
    const item = await StackItemModel.create({
      userId,
      projectId,
      toolId,
      lane,
      order,
    })
    
    logger.info('DB', `addToStack: tool=${toolId} → lane=${lane} order=${order}`)
    return this.mapStackItem(item)
  }

  static async updateStackItem(
    itemId: string,
    userId: string,
    data: { lane?: StackLane; order?: number }
  ): Promise<StackItem> {
    await connectToDatabase()
    
    const item = await StackItemModel.findOneAndUpdate(
      { _id: itemId, userId },
      {
        ...(data.lane && { lane: data.lane }),
        ...(data.order !== undefined && { order: data.order }),
      },
      { new: true }
    )
    
    if (!item) throw new Error('Stack item not found or unauthorized')
    
    logger.info('DB', `updateStackItem: ${itemId}`)
    return this.mapStackItem(item)
  }

  static async removeFromStack(itemId: string, userId: string): Promise<void> {
    await connectToDatabase()
    
    const result = await StackItemModel.deleteOne({ _id: itemId, userId })
    
    if (result.deletedCount === 0) {
      throw new Error('Stack item not found or unauthorized')
    }
    
    logger.info('DB', `removeFromStack: ${itemId}`)
  }

  // ─── Bulk Operations ─────────────────────────────────────────────────────
  static async clearAllData(userId: string): Promise<void> {
    await connectToDatabase()
    
    await ToolModel.deleteMany({ userId, isDefault: false })
    await ProjectModel.deleteMany({ userId })
    await StackItemModel.deleteMany({ userId })
    
    logger.warn('DB', `Cleared all data for user ${userId}`)
  }

  // ─── Helper Methods ──────────────────────────────────────────────────────
  private static mapTool(tool: any): Tool {
    return {
      $id: tool._id.toString(),
      $createdAt: tool.createdAt.toISOString(),
      userId: tool.userId,
      name: tool.name,
      description: tool.description,
      categories: tool.categories,
      url: tool.url,
      icon: tool.icon,
      color: tool.color,
      tags: tool.tags,
      isPublic: tool.isPublic,
      isDefault: tool.isDefault,
    }
  }

  private static mapProject(project: any): Project {
    return {
      $id: project._id.toString(),
      $createdAt: project.createdAt.toISOString(),
      userId: project.userId,
      name: project.name,
      description: project.description,
      color: project.color,
      notes: project.notes,
    }
  }

  private static mapStackItem(item: any): StackItem {
    return {
      $id: item._id.toString(),
      userId: item.userId,
      projectId: item.projectId,
      toolId: item.toolId,
      lane: item.lane,
      order: item.order,
    }
  }
}
