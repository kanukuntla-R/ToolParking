import type { Tool, ToolDraft, Project, ProjectDraft, StackItem, StackLane } from '@/types'
import { logger } from './logger'

// API Client - Makes HTTP requests to our backend API routes
class ApiClient {
  private baseUrl = '/api'

  private async request<T>(
    method: string,
    path: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`
    
    // Add query parameters
    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data)
    }
    
    logger.debug('API', `${method} ${url}`)
    
    const response = await fetch(url, options)
    const result = await response.json()
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || `API request failed: ${response.status}`)
    }
    
    return result.data
  }

  // ─── Tools ──────────────────────────────────────────────────────────────
  async getTools(): Promise<Tool[]> {
    return await this.request<Tool[]>('GET', '/tools')
  }

  async createTool(draft: ToolDraft): Promise<Tool> {
    return await this.request<Tool>('POST', '/tools', draft)
  }

  async getTool(id: string): Promise<Tool> {
    return await this.request<Tool>('GET', `/tools/${id}`)
  }

  async updateTool(id: string, data: Partial<ToolDraft>): Promise<Tool> {
    return await this.request<Tool>('PUT', `/tools/${id}`, data)
  }

  async deleteTool(id: string): Promise<void> {
    await this.request<void>('DELETE', `/tools/${id}`)
  }

  // ─── Projects ────────────────────────────────────────────────────────────
  async getProjects(): Promise<Project[]> {
    return await this.request<Project[]>('GET', '/projects')
  }

  async createProject(draft: ProjectDraft): Promise<Project> {
    return await this.request<Project>('POST', '/projects', draft)
  }

  async getProject(id: string): Promise<Project> {
    return await this.request<Project>('GET', `/projects/${id}`)
  }

  async updateProject(id: string, data: Partial<ProjectDraft>): Promise<Project> {
    return await this.request<Project>('PUT', `/projects/${id}`, data)
  }

  async deleteProject(id: string): Promise<void> {
    await this.request<void>('DELETE', `/projects/${id}`)
  }

  // ─── Stack Items ─────────────────────────────────────────────────────────
  async getStackItems(projectId: string): Promise<StackItem[]> {
    return await this.request<StackItem[]>('GET', '/stack', undefined, { projectId })
  }

  async addToStack(
    projectId: string,
    toolId: string,
    lane: StackLane,
    order: number
  ): Promise<StackItem> {
    return await this.request<StackItem>('POST', '/stack', {
      projectId,
      toolId,
      lane,
      order,
    })
  }

  async updateStackItem(
    id: string,
    data: { lane?: StackLane; order?: number }
  ): Promise<StackItem> {
    return await this.request<StackItem>('PUT', `/stack/${id}`, data)
  }

  async removeFromStack(id: string): Promise<void> {
    await this.request<void>('DELETE', `/stack/${id}`)
  }
}

export const apiClient = new ApiClient()
