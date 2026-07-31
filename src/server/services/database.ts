import type { Tool, ToolDraft, ToolCategory, Project, ProjectDraft, StackItem, StackLane } from '@/types'
import { DEFAULT_TOOLS } from '@/lib/seed-data'
import { logger } from '@/lib/logger'
import { getAdminClient } from '@/lib/pocketbase'

export class DatabaseService {
  // ─── Seed Management ─────────────────────────────────────────────────────
  static async seedDefaults(userId: string): Promise<void> {
    const pb = await getAdminClient()

    const existing = await pb.collection('tools').getList(1, 1, {
      filter: `userId = "${userId}"`,
    })

    if (existing.totalItems > 0) {
      logger.info('SEED', `User ${userId} already has ${existing.totalItems} tools, skipping seed`)
      return
    }

    for (const tool of DEFAULT_TOOLS) {
      await pb.collection('tools').create({
        name: tool.name,
        description: tool.description,
        categories: tool.categories,
        url: tool.url,
        icon: tool.icon,
        color: tool.color,
        tags: tool.tags,
        userId,
        isPublic: tool.isPublic,
        isDefault: true,
      })
    }

    logger.info('SEED', `Seeded ${DEFAULT_TOOLS.length} default tools for user ${userId}`)
  }

  // ─── Tools ───────────────────────────────────────────────────────────────
  static async getTools(userId: string): Promise<Tool[]> {
    try {
      const pb = await getAdminClient()

      const result = await pb.collection('tools').getList(1, 500, {
        filter: `userId = "${userId}" || isPublic = true`,
      })

      logger.debug('DB', `getTools(${userId}) → ${result.items.length} tools`)
      return result.items.map(this.mapTool)
    } catch (err: any) {
      logger.error('DB', 'getTools failed', err)
      if (err?.status === 404 || err?.message?.includes('not found')) {
        throw new Error(
          'PocketBase collection "tools" not found. Create it in the PocketBase admin UI. ' +
          'See README.md for the required schema.'
        )
      }
      throw err
    }
  }

  static async getToolById(toolId: string): Promise<Tool | null> {
    const pb = await getAdminClient()

    try {
      const record = await pb.collection('tools').getOne(toolId)
      return this.mapTool(record)
    } catch {
      return null
    }
  }

  static async createTool(userId: string, draft: ToolDraft): Promise<Tool> {
    const pb = await getAdminClient()

    const record = await pb.collection('tools').create({
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

    logger.info('DB', `createTool: "${record.name}" (${record.id})`)
    return this.mapTool(record)
  }

  static async updateTool(toolId: string, userId: string, data: Partial<ToolDraft>): Promise<Tool> {
    const pb = await getAdminClient()

    const updateData: Record<string, unknown> = {}
    if (data.name) updateData.name = data.name.trim()
    if (data.description !== undefined) updateData.description = data.description.trim()
    if (data.categories) updateData.categories = data.categories
    if (data.url !== undefined) updateData.url = data.url.trim()
    if (data.icon !== undefined) updateData.icon = data.icon
    if (data.color) updateData.color = data.color
    if (data.tags) updateData.tags = data.tags
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic

    const record = await pb.collection('tools').getOne(toolId)
    if (record.userId !== userId) throw new Error('Tool not found or unauthorized')

    const updated = await pb.collection('tools').update(toolId, updateData)

    logger.info('DB', `updateTool: "${updated.name}" (${toolId})`)
    return this.mapTool(updated)
  }

  static async deleteTool(toolId: string, userId: string): Promise<void> {
    const pb = await getAdminClient()

    const record = await pb.collection('tools').getOne(toolId)
    if (record.userId !== userId) throw new Error('Tool not found or unauthorized')

    const stackItems = await pb.collection('stack_items').getList(1, 500, {
      filter: `toolId = "${toolId}"`,
    })
    for (const item of stackItems.items) {
      await pb.collection('stack_items').delete(item.id)
    }

    await pb.collection('tools').delete(toolId)
    logger.info('DB', `deleteTool: ${toolId}`)
  }

  // ─── Projects ────────────────────────────────────────────────────────────
  static async getProjects(userId: string): Promise<Project[]> {
    const pb = await getAdminClient()

    const result = await pb.collection('projects').getList(1, 500, {
      filter: `userId = "${userId}"`,
    })

    logger.debug('DB', `getProjects(${userId}) → ${result.items.length} projects`)
    return result.items.map(this.mapProject)
  }

  static async getProjectById(projectId: string, userId: string): Promise<Project | null> {
    const pb = await getAdminClient()

    try {
      const record = await pb.collection('projects').getOne(projectId)
      if (record.userId !== userId) return null
      return this.mapProject(record)
    } catch {
      return null
    }
  }

  static async createProject(userId: string, draft: ProjectDraft): Promise<Project> {
    const pb = await getAdminClient()

    const record = await pb.collection('projects').create({
      userId,
      name: draft.name.trim(),
      description: draft.description?.trim() ?? '',
      color: draft.color ?? '#22c55e',
      notes: draft.notes ?? '',
    })

    logger.info('DB', `createProject: "${record.name}" (${record.id})`)
    return this.mapProject(record)
  }

  static async updateProject(projectId: string, userId: string, data: Partial<ProjectDraft>): Promise<Project> {
    const pb = await getAdminClient()

    const existing = await pb.collection('projects').getOne(projectId)
    if (existing.userId !== userId) throw new Error('Project not found or unauthorized')

    const updateData: Record<string, unknown> = {}
    if (data.name) updateData.name = data.name.trim()
    if (data.description !== undefined) updateData.description = data.description.trim()
    if (data.color) updateData.color = data.color
    if (data.notes !== undefined) updateData.notes = data.notes

    const updated = await pb.collection('projects').update(projectId, updateData)

    logger.info('DB', `updateProject: "${updated.name}" (${projectId})`)
    return this.mapProject(updated)
  }

  static async deleteProject(projectId: string, userId: string): Promise<void> {
    const pb = await getAdminClient()

    const existing = await pb.collection('projects').getOne(projectId)
    if (existing.userId !== userId) throw new Error('Project not found or unauthorized')

    const stackItems = await pb.collection('stack_items').getList(1, 500, {
      filter: `projectId = "${projectId}"`,
    })
    for (const item of stackItems.items) {
      await pb.collection('stack_items').delete(item.id)
    }

    await pb.collection('projects').delete(projectId)
    logger.info('DB', `deleteProject: ${projectId}`)
  }

  // ─── Stack Items ─────────────────────────────────────────────────────────
  static async getStackItems(projectId: string, userId: string): Promise<StackItem[]> {
    const pb = await getAdminClient()

    const project = await pb.collection('projects').getOne(projectId)
    if (project.userId !== userId) throw new Error('Project not found or unauthorized')

    const result = await pb.collection('stack_items').getList(1, 500, {
      filter: `projectId = "${projectId}"`,
      sort: 'order',
    })

    logger.debug('DB', `getStackItems(${projectId}) → ${result.items.length} items`)
    return result.items.map(this.mapStackItem)
  }

  static async addToStack(
    userId: string,
    projectId: string,
    toolId: string,
    lane: StackLane,
    order: number
  ): Promise<StackItem> {
    const pb = await getAdminClient()

    const project = await pb.collection('projects').getOne(projectId)
    if (project.userId !== userId) throw new Error('Project not found or unauthorized')

    const tool = await pb.collection('tools').getOne(toolId)
    if (tool.userId !== userId && tool.isPublic !== true) {
      throw new Error('Tool not found or unauthorized')
    }

    const existing = await pb.collection('stack_items').getList(1, 1, {
      filter: `projectId = "${projectId}" && toolId = "${toolId}"`,
    })
    if (existing.totalItems > 0) {
      throw new Error('Validation failed: Tool is already in this project')
    }

    const record = await pb.collection('stack_items').create({
      userId,
      projectId,
      toolId,
      lane,
      order,
    })

    logger.info('DB', `addToStack: tool=${toolId} → lane=${lane} order=${order}`)
    return this.mapStackItem(record)
  }

  static async updateStackItem(
    itemId: string,
    userId: string,
    data: { lane?: StackLane; order?: number }
  ): Promise<StackItem> {
    const pb = await getAdminClient()

    const existing = await pb.collection('stack_items').getOne(itemId)
    if (existing.userId !== userId) throw new Error('Stack item not found or unauthorized')

    const updateData: Record<string, unknown> = {}
    if (data.lane) updateData.lane = data.lane
    if (data.order !== undefined) updateData.order = data.order

    const updated = await pb.collection('stack_items').update(itemId, updateData)

    logger.info('DB', `updateStackItem: ${itemId}`)
    return this.mapStackItem(updated)
  }

  static async removeFromStack(itemId: string, userId: string): Promise<void> {
    const pb = await getAdminClient()

    const existing = await pb.collection('stack_items').getOne(itemId)
    if (existing.userId !== userId) throw new Error('Stack item not found or unauthorized')

    await pb.collection('stack_items').delete(itemId)
    logger.info('DB', `removeFromStack: ${itemId}`)
  }

  // ─── Bulk Operations ─────────────────────────────────────────────────────
  static async clearAllData(userId: string): Promise<void> {
    const pb = await getAdminClient()

    const tools = await pb.collection('tools').getList(1, 500, {
      filter: `userId = "${userId}" && isDefault = false`,
    })
    for (const t of tools.items) {
      await pb.collection('tools').delete(t.id)
    }

    const projects = await pb.collection('projects').getList(1, 500, {
      filter: `userId = "${userId}"`,
    })
    for (const p of projects.items) {
      await pb.collection('projects').delete(p.id)
    }

    const stackItems = await pb.collection('stack_items').getList(1, 500, {
      filter: `userId = "${userId}"`,
    })
    for (const s of stackItems.items) {
      await pb.collection('stack_items').delete(s.id)
    }

    logger.warn('DB', `Cleared all data for user ${userId}`)
  }

  // ─── Helper Methods ──────────────────────────────────────────────────────
  private static mapTool(record: Record<string, unknown>): Tool {
    return {
      $id: record.id as string,
      $createdAt: ((record.created as string | undefined) ?? (record.createdAt as string | undefined) ?? '') as string,
      userId: record.userId as string,
      name: record.name as string,
      description: (record.description as string) ?? '',
      categories: (record.categories as ToolCategory[]) ?? ['other'],
      url: (record.url as string) ?? '',
      icon: (record.icon as string) ?? '',
      color: (record.color as string) ?? '#22c55e',
      tags: (record.tags as string[]) ?? [],
      isPublic: (record.isPublic as boolean) ?? false,
      isDefault: (record.isDefault as boolean) ?? false,
    }
  }

  private static mapProject(record: Record<string, unknown>): Project {
    return {
      $id: record.id as string,
      $createdAt: ((record.created as string | undefined) ?? (record.createdAt as string | undefined) ?? '') as string,
      userId: record.userId as string,
      name: record.name as string,
      description: (record.description as string) ?? '',
      color: (record.color as string) ?? '#22c55e',
      notes: (record.notes as string) ?? '',
    }
  }

  private static mapStackItem(record: Record<string, unknown>): StackItem {
    return {
      $id: record.id as string,
      userId: record.userId as string,
      projectId: record.projectId as string,
      toolId: record.toolId as string,
      lane: record.lane as StackItem['lane'],
      order: record.order as number,
    }
  }
}
