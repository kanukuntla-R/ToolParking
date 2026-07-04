import { create } from 'zustand'
import type { AppUser, Tool, Project, StackItem } from '@/types'
import { logger } from '@/lib/logger'

interface AppStore {
  // Auth
  user: AppUser | null
  setUser: (u: AppUser | null) => void

  // Tools (parking lot)
  tools: Tool[]
  setTools: (tools: Tool[]) => void
  addTool:    (t: Tool)   => void
  updateTool: (t: Tool)   => void
  removeTool: (id: string) => void

  // Projects
  projects: Project[]
  setProjects: (projects: Project[]) => void
  addProject:    (p: Project)    => void
  updateProject: (p: Project)    => void
  removeProject: (id: string)    => void

  // Active project stack
  stackItems: StackItem[]
  setStackItems: (items: StackItem[]) => void
  addStackItem:    (item: StackItem)   => void
  removeStackItem: (id: string)        => void
  updateStackItem: (item: StackItem)   => void

  // UI
  searchQuery:    string
  activeFilter:   string
  activeProject:  string | null
  setSearchQuery:   (q: string)  => void
  setActiveFilter:  (f: string)  => void
  setActiveProject: (id: string | null) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  setUser: (user) => { set({ user }); logger.debug('STORE', `setUser: ${user?.name ?? 'null'}`) },

  tools: [],
  setTools: (tools) => { set({ tools }); logger.debug('STORE', `setTools: ${tools.length} items`) },
  addTool:    (t) => { set((s) => ({ tools: [t, ...s.tools] })); logger.info('STORE', `addTool: "${t.name}"`) },
  updateTool: (t) => { set((s) => ({ tools: s.tools.map((x) => x.$id === t.$id ? t : x) })); logger.info('STORE', `updateTool: "${t.name}"`) },
  removeTool: (id) => { const t = get().tools.find((x) => x.$id === id); set((s) => ({ tools: s.tools.filter((x) => x.$id !== id) })); logger.info('STORE', `removeTool: "${t?.name ?? id}"`) },

  projects: [],
  setProjects: (projects) => { set({ projects }); logger.debug('STORE', `setProjects: ${projects.length} items`) },
  addProject:    (p) => { set((s) => ({ projects: [p, ...s.projects] })); logger.info('STORE', `addProject: "${p.name}"`) },
  updateProject: (p) => { set((s) => ({ projects: s.projects.map((x) => x.$id === p.$id ? p : x) })); logger.info('STORE', `updateProject: "${p.name}"`) },
  removeProject: (id) => { const p = get().projects.find((x) => x.$id === id); set((s) => ({ projects: s.projects.filter((x) => x.$id !== id) })); logger.info('STORE', `removeProject: "${p?.name ?? id}"`) },

  stackItems: [],
  setStackItems: (stackItems) => { set({ stackItems }); logger.debug('STORE', `setStackItems: ${stackItems.length} items`) },
  addStackItem:    (item) => { set((s) => ({ stackItems: [...s.stackItems, item] })); logger.info('STORE', `addStackItem: ${item.$id}`) },
  removeStackItem: (id)   => { set((s) => ({ stackItems: s.stackItems.filter((x) => x.$id !== id) })); logger.info('STORE', `removeStackItem: ${id}`) },
  updateStackItem: (item) => { set((s) => ({ stackItems: s.stackItems.map((x) => x.$id === item.$id ? item : x) })); logger.info('STORE', `updateStackItem: ${item.$id}`) },

  searchQuery:   '',
  activeFilter:  'all',
  activeProject: null,
  setSearchQuery:   (searchQuery)   => { set({ searchQuery }); logger.debug('STORE', `searchQuery: "${searchQuery}"`) },
  setActiveFilter:  (activeFilter)  => { set({ activeFilter }); logger.debug('STORE', `activeFilter: "${activeFilter}"`) },
  setActiveProject: (activeProject) => { set({ activeProject }); logger.info('STORE', `activeProject: ${activeProject ?? 'null'}`) },
}))
