'use client'
import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  DndContext, DragEndEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors,
  closestCorners, DragOverlay,
} from '@dnd-kit/core'
import { Plus, ChevronDown, Trash2, Layers, ParkingSquare, FileText } from 'lucide-react'
import { getProjects, getTools, getStackItems, addToStack, deleteProject, updateStackItem, updateProject } from '@/lib/db'
import { useAppStore } from '@/store'
import { CATEGORY_TO_LANE, ALL_LANES, cn } from '@/lib/utils'
import StackLane from '@/components/projects/StackLane'
import CreateProjectModal from '@/components/projects/CreateProjectModal'
import CategoryToolPanel from '@/components/ui/CategoryToolPanel'
import MarkdownEditor from '@/components/projects/MarkdownEditor'
import { logger } from '@/lib/logger'
import type { StackItem, StackLane as SLane, Tool } from '@/types'
import { GripVertical } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'

function DragOverlayCard({ tool }: { tool: Tool }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 glass rounded-xl border border-accent/20 glow-green w-64 pointer-events-none">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-medium shrink-0 overflow-hidden"
        style={{ backgroundColor: tool.color + '20', color: tool.color }}>
        {tool.icon?.startsWith('http') ? (
          <img src={tool.icon} alt="" className="w-6 h-6 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        ) : (
          tool.icon || tool.name[0]?.toUpperCase()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{tool.name}</p>
        <p className="text-xs text-neutral-500 truncate">{tool.description}</p>
      </div>
    </div>
  )
}

function ParkingToolCard({ tool }: { tool: Tool }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: tool.$id })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'glass-card flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-150',
        isDragging && 'opacity-60 glow-green-sm'
      )}
    >
      <GripVertical size={14} className="text-neutral-700 pointer-events-none shrink-0 hidden md:block" />
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 pointer-events-none font-medium overflow-hidden"
        style={{ backgroundColor: tool.color + '20', color: tool.color }}>
        {tool.icon?.startsWith('http') ? (
          <img src={tool.icon} alt="" className="w-5 h-5 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        ) : (
          tool.icon || tool.name[0]?.toUpperCase()
        )}
      </div>
      <span className="text-sm font-medium text-neutral-300 flex-1 truncate pointer-events-none">{tool.name}</span>
    </div>
  )
}

export default function ProjectsPage() {
  const {
    user, tools, setTools,
    projects, setProjects,
    stackItems, setStackItems, addStackItem,
    activeProject, setActiveProject,
  } = useAppStore()

  const [showCreateModal, setShowCreateModal]   = useState(false)
  const [activeDragToolId, setActiveDragToolId] = useState<string | null>(null)
  const [showProjectMenu, setShowProjectMenu]   = useState(false)
  const [mobileTab, setMobileTab]               = useState<'tools' | 'stack' | 'notes'>('stack')
  const [projectNotes, setProjectNotes] = useState('')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const { data: fetchedProjects } = useQuery({
    queryKey: ['projects', user?.$id],
    queryFn:  () => getProjects(user!.$id),
    enabled:  !!user,
  })

  useEffect(() => {
    if (fetchedProjects) {
      setProjects(fetchedProjects)
      if (!activeProject && fetchedProjects.length > 0) setActiveProject(fetchedProjects[0].$id)
    }
  }, [fetchedProjects])

  const { data: fetchedTools } = useQuery({
    queryKey: ['tools', user?.$id],
    queryFn:  () => getTools(user!.$id),
    enabled:  !!user,
  })

  useEffect(() => {
    if (fetchedTools) setTools(fetchedTools)
  }, [fetchedTools])

  useEffect(() => {
    setStackItems([])
  }, [activeProject])

  const { data: fetchedStack } = useQuery({
    queryKey: ['stack', activeProject],
    queryFn:  () => getStackItems(activeProject!),
    enabled:  !!activeProject,
  })

  useEffect(() => {
    if (fetchedStack) setStackItems(fetchedStack)
  }, [fetchedStack])

  const currentProject = projects.find((p) => p.$id === activeProject)

  // Load notes when active project changes
  useEffect(() => {
    if (currentProject) {
      setProjectNotes(currentProject.notes || '')
    } else {
      setProjectNotes('')
    }
  }, [activeProject, currentProject])

  // Debounced save for notes
  useEffect(() => {
    if (!activeProject) return
    const timer = setTimeout(async () => {
      try {
        await updateProject(activeProject, { notes: projectNotes })
        const { updateProject: updateInStore } = useAppStore.getState()
        if (currentProject) {
          updateInStore({ ...currentProject, notes: projectNotes })
        }
      } catch (err) {
        logger.error('PROJECTS', 'Failed to save notes', err)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [projectNotes, activeProject, currentProject])

  const hydratedStack: StackItem[] = useMemo(() =>
    stackItems.map((item) => ({
      ...item,
      tool: tools.find((t) => t.$id === item.toolId),
    })), [stackItems, tools])

  const laneMap = useMemo(() => {
    const map: Record<SLane, StackItem[]> = { Frontend: [], Backend: [], Database: [], DevOps: [], Auth: [], Other: [] }
    hydratedStack.forEach((item) => { map[item.lane]?.push(item) })
    return map
  }, [hydratedStack])

  const [activeDragStackItem, setActiveDragStackItem] = useState<StackItem | null>(null)
  const activeDragTool = activeDragToolId ? tools.find((t) => t.$id === activeDragToolId) : null

  function resolveLane(overId: string): SLane | null {
    if (overId.startsWith('lane-')) return overId.replace('lane-', '') as SLane
    const targetItem = stackItems.find((i) => i.$id === overId)
    if (targetItem) return targetItem.lane
    return null
  }

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string
    const isTool = tools.some((t) => t.$id === id)
    if (isTool) {
      setActiveDragToolId(id)
    } else {
      const item = hydratedStack.find((i) => i.$id === id)
      if (item) setActiveDragStackItem(item)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveDragToolId(null)
    setActiveDragStackItem(null)
    const { active, over } = event
    if (!over || !activeProject || !user) return

    const overId = over.id as string
    const activeId = active.id as string

    const isTool = tools.some((t) => t.$id === activeId)
    const existingItem = stackItems.find((i) => i.$id === activeId)

    if (!isTool && !existingItem) return

    const lane = resolveLane(overId)
    if (!lane) return

    if (isTool) {
      const order = laneMap[lane]?.length ?? 0
      const tempItem: StackItem = {
        $id: `temp-${Date.now()}`,
        projectId: activeProject,
        toolId: activeId,
        lane,
        order,
        userId: user.$id,
        tool: tools.find((t) => t.$id === activeId),
      }
      addStackItem(tempItem)

      try {
        const saved = await addToStack(user.$id, activeProject, activeId, lane, order)
        useAppStore.getState().removeStackItem(tempItem.$id)
        addStackItem({ ...saved, tool: tools.find((t) => t.$id === activeId) })
      } catch {
        useAppStore.getState().removeStackItem(tempItem.$id)
      }
    } else if (existingItem && existingItem.lane !== lane) {
      const order = laneMap[lane]?.length ?? 0
      useAppStore.getState().removeStackItem(activeId)
      addStackItem({ ...existingItem, lane, order })
      try {
        await updateStackItem(activeId, { lane, order })
      } catch {
        useAppStore.getState().removeStackItem(activeId)
        addStackItem(existingItem)
      }
    }
  }

  // Mobile: add tool to stack by tapping (auto-assigns lane by category)
  async function handleMobileAddToStack(tool: Tool) {
    if (!activeProject || !user) return
    const lane = CATEGORY_TO_LANE[tool.category] || 'Other'
    const order = laneMap[lane]?.length ?? 0
    const tempItem: StackItem = {
      $id: `temp-${Date.now()}`,
      projectId: activeProject,
      toolId: tool.$id,
      lane,
      order,
      userId: user.$id,
      tool,
    }
    addStackItem(tempItem)
    setMobileTab('stack')

    try {
      const saved = await addToStack(user.$id, activeProject, tool.$id, lane, order)
      useAppStore.getState().removeStackItem(tempItem.$id)
      addStackItem({ ...saved, tool })
    } catch {
      useAppStore.getState().removeStackItem(tempItem.$id)
    }
  }

  async function handleDeleteProject() {
    if (!activeProject || !confirm('Delete this project?')) return
    const prev = projects.find((p) => p.$id !== activeProject)
    useAppStore.getState().removeProject(activeProject)
    setActiveProject(prev?.$id || null)
    try { await deleteProject(activeProject) } catch {}
  }

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* ===== MOBILE: Project selector + tab switcher ===== */}
        <div className="md:hidden shrink-0">
          {/* Project header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] glass">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {currentProject && (
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: currentProject.color }} />
              )}
              <div className="relative flex-1">
                <button
                  onClick={() => setShowProjectMenu(!showProjectMenu)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-white"
                >
                  <span className="truncate">{currentProject?.name || 'Select project'}</span>
                  <ChevronDown size={14} className="text-neutral-500 shrink-0" />
                </button>
                {showProjectMenu && (
                  <div className="absolute top-full left-0 mt-2 w-56 glass rounded-xl border border-white/[0.06] shadow-2xl z-30 overflow-hidden">
                    {projects.map((p) => (
                      <button key={p.$id}
                        onClick={() => { setActiveProject(p.$id); setShowProjectMenu(false) }}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-surface-300 transition-colors',
                          p.$id === activeProject && 'bg-surface-300 text-accent'
                        )}>
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                        <span className="truncate text-neutral-300">{p.name}</span>
                      </button>
                    ))}
                    <div className="border-t border-white/[0.04]">
                      <button onClick={() => { setShowProjectMenu(false); setShowCreateModal(true) }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-accent hover:bg-surface-300 transition-colors">
                        <Plus size={14} />
                        New project
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-600">{stackItems.length} tools</span>
              <button onClick={() => setShowCreateModal(true)}
                className="p-2 rounded-xl bg-accent/10 text-accent border border-accent/20">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Mobile tab switcher */}
          <div className="flex border-b border-white/[0.04]">
            <button
              onClick={() => setMobileTab('stack')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all border-b-2',
                mobileTab === 'stack'
                  ? 'text-accent border-accent'
                  : 'text-neutral-600 border-transparent'
              )}
            >
              <Layers size={14} />
              Stack
            </button>
            <button
              onClick={() => setMobileTab('tools')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all border-b-2',
                mobileTab === 'tools'
                  ? 'text-accent border-accent'
                  : 'text-neutral-600 border-transparent'
              )}
            >
              <ParkingSquare size={14} />
              Tools
            </button>
            <button
              onClick={() => setMobileTab('notes')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all border-b-2',
                mobileTab === 'notes'
                  ? 'text-accent border-accent'
                  : 'text-neutral-600 border-transparent'
              )}
            >
              <FileText size={14} />
              Notes
            </button>
          </div>
        </div>

        {/* ===== DESKTOP: Left parking panel (hidden on mobile) | MOBILE: shown when tools tab active ===== */}
        <div className={cn(
          'md:w-72 lg:w-80 shrink-0 flex flex-col border-r border-white/[0.04] glass',
          mobileTab === 'tools' ? 'flex' : 'hidden md:flex',
          'flex-1 md:flex-none'
        )}>
          <CategoryToolPanel tools={tools} onSelect={handleMobileAddToStack} />
        </div>

        {/* ===== Right: project workspace ===== */}
        <div className={cn(
          'flex-1 flex flex-col overflow-hidden',
          mobileTab === 'stack' || mobileTab === 'notes' ? 'flex' : 'hidden md:flex'
        )}>
          {/* Desktop project selector header */}
          <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-white/[0.04] glass">
            <div className="flex items-center gap-4">
              {currentProject && (
                <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: currentProject.color }} />
              )}
              <div className="relative">
                <button
                  onClick={() => setShowProjectMenu(!showProjectMenu)}
                  className="flex items-center gap-2 text-lg font-bold text-white hover:text-accent transition-colors"
                >
                  {currentProject?.name || 'Select project'}
                  <ChevronDown size={16} className="text-neutral-500" />
                </button>
                {showProjectMenu && (
                  <div className="absolute top-full left-0 mt-2 w-56 glass rounded-xl border border-white/[0.06] shadow-2xl z-20 overflow-hidden">
                    {projects.map((p) => (
                      <button key={p.$id}
                        onClick={() => { setActiveProject(p.$id); setShowProjectMenu(false) }}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-surface-300 transition-colors',
                          p.$id === activeProject && 'bg-surface-300 text-accent'
                        )}>
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                        <span className="truncate text-neutral-300">{p.name}</span>
                      </button>
                    ))}
                    <div className="border-t border-white/[0.04]">
                      <button onClick={() => { setShowProjectMenu(false); setShowCreateModal(true) }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-accent hover:bg-surface-300 transition-colors">
                        <Plus size={14} />
                        New project
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {currentProject?.description && (
                <span className="text-sm text-neutral-600">{currentProject.description}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs font-mono text-neutral-500 bg-surface-300 px-3 py-1.5 rounded-lg border border-white/[0.04]">
                {stackItems.length} tool{stackItems.length !== 1 ? 's' : ''} in stack
              </div>
              {currentProject && (
                <button onClick={handleDeleteProject}
                  className="p-2 rounded-xl hover:bg-red-500/10 text-neutral-600 hover:text-red-400 transition-all">
                  <Trash2 size={16} />
                </button>
              )}
              <button onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-black text-sm font-semibold hover:bg-accent-500 transition-all">
                <Plus size={14} />
                New project
              </button>
            </div>
          </div>

          {/* Lane grid */}
          {!activeProject ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center mb-4">
                <Layers size={28} className="text-accent/40" />
              </div>
              <p className="text-sm font-medium text-neutral-300">No project selected</p>
              <p className="text-xs text-neutral-600 mt-1 mb-4">Create a project to start building your tech stack</p>
              <button onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-black text-xs font-semibold hover:bg-accent-500 transition-all">
                <Plus size={13} />
                Create project
              </button>
            </div>
          ) : mobileTab === 'notes' ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <MarkdownEditor
                value={projectNotes}
                onChange={setProjectNotes}
                projectName={currentProject?.name || 'Project'}
                tools={hydratedStack.map((item) => ({
                  name: item.tool?.name || 'Unknown',
                  category: item.tool?.category || 'other',
                  lane: item.lane,
                }))}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {ALL_LANES.map((lane) => (
                  <StackLane key={lane} lane={lane} items={laneMap[lane] || []} />
                ))}
              </div>
              <p className="hidden md:block text-xs text-neutral-700 text-center mt-8 font-mono">
                drag tools from the left panel into lanes
              </p>

              {/* Notes Panel — always visible */}
              {currentProject && (
                <div className="mt-6 glass-card rounded-2xl border border-white/[0.04] overflow-hidden" style={{ height: '400px' }}>
                  <MarkdownEditor
                    value={projectNotes}
                    onChange={setProjectNotes}
                    projectName={currentProject.name}
                    tools={hydratedStack.map((item) => ({
                      name: item.tool?.name || 'Unknown',
                      category: item.tool?.category || 'other',
                      lane: item.lane,
                    }))}
                  />
                </div>
              )}
            </div>
          )}

          {/* Mobile: delete project button */}
          {currentProject && mobileTab === 'stack' && (
            <div className="md:hidden px-4 py-3 border-t border-white/[0.04]">
              <button onClick={handleDeleteProject}
                className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-all">
                Delete project
              </button>
            </div>
          )}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDragTool && <DragOverlayCard tool={activeDragTool} />}
          {activeDragStackItem?.tool && <DragOverlayCard tool={activeDragStackItem.tool} />}
        </DragOverlay>
      </DndContext>

      {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
