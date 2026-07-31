'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useClerk } from '@clerk/nextjs'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import { ParkingSquare, FolderKanban, LogOut, User, Settings, ChevronDown, ChevronRight, Plus, Trash2, Pencil, Check, X, Timer, Play, Pause, RotateCcw } from 'lucide-react'
import { createProject, deleteProject, updateProject, getProjects } from '@/lib/db'
import { logger } from '@/lib/logger'

const PROJECT_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f43f5e', '#f97316', '#06b6d4', '#eab308']

interface EditingProject {
  id: string
  name: string
  color: string
}

function SidebarTimer() {
  const [elapsed, setElapsed] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)

  useEffect(() => {
    if (startedAt === null) return
    const tick = () => setElapsed(Date.now() - startedAt)
    tick()
    const interval = window.setInterval(tick, 250)
    return () => window.clearInterval(interval)
  }, [startedAt])

  const seconds = Math.floor(elapsed / 1000)
  const display = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  const running = startedAt !== null

  function toggle() {
    if (startedAt !== null) {
      setElapsed(Date.now() - startedAt)
      setStartedAt(null)
    } else {
      setStartedAt(Date.now() - elapsed)
    }
  }

  return (
    <div className="mt-auto pt-4">
      <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-white/[0.04] bg-surface-200/70">
        <Timer size={13} className="text-neutral-600 shrink-0" />
        <time dateTime={`PT${seconds}S`} className="flex-1 text-xs font-mono tabular-nums text-neutral-400">
          {display}
        </time>
        <button
          onClick={toggle}
          aria-label={running ? 'Pause timer' : 'Start timer'}
          title={running ? 'Pause' : 'Start'}
          className="p-1.5 rounded-md text-neutral-500 hover:bg-surface-400 hover:text-accent transition-colors"
        >
          {running ? <Pause size={12} /> : <Play size={12} />}
        </button>
        <button
          onClick={() => { setElapsed(0); setStartedAt(null) }}
          aria-label="Reset timer"
          title="Reset"
          disabled={elapsed === 0}
          className="p-1.5 rounded-md text-neutral-600 hover:bg-surface-400 hover:text-neutral-300 disabled:opacity-30 transition-colors"
        >
          <RotateCcw size={12} />
        </button>
      </div>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { signOut } = useClerk()
  const { user, setUser, projects, setProjects, addProject, removeProject, activeProject, setActiveProject } = useAppStore()
  const [projectsExpanded, setProjectsExpanded] = useState(true)
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [editingProject, setEditingProject] = useState<EditingProject | null>(null)

  // Load projects on mount to ensure sidebar always shows them
  useEffect(() => {
    if (user && projects.length === 0) {
      getProjects(user.$id).then((fetched) => {
        if (fetched.length > 0) {
          setProjects(fetched)
          if (!activeProject) {
            setActiveProject(fetched[0].$id)
          }
        }
      })
    }
  }, [user, projects.length, activeProject, setProjects, setActiveProject])

  // Load saved accent color on mount
  useEffect(() => {
    const savedAccent = localStorage.getItem('accent-color')
    if (savedAccent) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(savedAccent)
      if (result) {
        const rgb = `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
        document.documentElement.style.setProperty('--accent', rgb)
      }
    }
  }, [])

  async function handleLogout() {
    setUser(null)
    await signOut({ redirectUrl: '/sign-in' })
    logger.info('AUTH', 'User signed out via Clerk')
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault()
    if (!newProjectName.trim() || !user) return
    try {
      const project = await createProject(user.$id, { name: newProjectName.trim(), description: '', color: '#22c55e' })
      addProject(project)
      setActiveProject(project.$id)
      setNewProjectName('')
      setShowNewProject(false)
      logger.info('LAYOUT', `Created project: ${project.name}`)
    } catch (err: any) {
      logger.error('LAYOUT', 'Failed to create project', err)
      alert(err?.message || 'Failed to create project')
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('Delete this project?')) return
    try {
      await deleteProject(id)
      removeProject(id)
      if (activeProject === id) setActiveProject(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete project')
    }
  }

  function startEditProject(project: { $id: string; name: string; color: string }) {
    setEditingProject({ id: project.$id, name: project.name, color: project.color })
  }

  async function saveEditProject() {
    if (!editingProject) return
    try {
      const updated = await updateProject(editingProject.id, { name: editingProject.name, color: editingProject.color })
      const { updateProject: updateInStore } = useAppStore.getState()
      updateInStore(updated)
      setEditingProject(null)
      logger.info('LAYOUT', `Updated project: ${updated.name}`)
    } catch (err: any) {
      logger.error('LAYOUT', 'Failed to update project', err)
    }
  }

  const isProjectsPage = pathname.startsWith('/app/projects')
  const isParkingPage = pathname.startsWith('/app/parking')
  const isSettingsPage = pathname.startsWith('/app/settings')

  return (
    <div className="flex h-screen overflow-hidden bg-surface relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />

      {/* ===== DESKTOP SIDEBAR (hidden on mobile) ===== */}
      <aside className="hidden md:flex w-60 flex-col glass shrink-0 z-10 relative">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.04]">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-white block leading-tight">Tool Parking</span>
            <span className="text-[10px] text-neutral-600 font-mono">v1.0</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 py-4 px-3 overflow-y-auto scrollbar-thin">
          {/* Parking */}
          <Link href="/app/parking"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
              isParkingPage
                ? 'bg-accent/10 text-accent border border-accent/15 glow-green-sm'
                : 'text-neutral-500 hover:bg-surface-300 hover:text-neutral-200 border border-transparent'
            )}
          >
            <ParkingSquare size={16} className="shrink-0" />
            <span className="font-medium">Parking</span>
            {isParkingPage && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />}
          </Link>

          {/* Projects - expandable */}
          <div>
            <button
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                isProjectsPage
                  ? 'bg-accent/10 text-accent border border-accent/15 glow-green-sm'
                  : 'text-neutral-500 hover:bg-surface-300 hover:text-neutral-200 border border-transparent'
              )}
            >
              {projectsExpanded ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0" />}
              <FolderKanban size={16} className="shrink-0" />
              <span className="font-medium">Projects</span>
              {projects.length > 0 && (
                <span className="ml-auto text-[10px] font-mono text-neutral-600 bg-surface-400 px-1.5 py-0.5 rounded-md">{projects.length}</span>
              )}
            </button>

            {projectsExpanded && (
              <div className="mt-1 ml-4 pl-4 border-l border-white/[0.04] space-y-0.5">
                {projects.map((p) => {
                  const isActive = activeProject === p.$id && isProjectsPage
                  const isEditing = editingProject?.id === p.$id

                  if (isEditing && editingProject) {
                    return (
                      <div key={p.$id} className="px-2 py-1 space-y-1.5">
                        <input
                          autoFocus
                          value={editingProject.name}
                          onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                          className="w-full px-2 py-1 text-xs rounded-lg border border-surface-400 bg-surface-200 text-white focus:outline-none focus:ring-1 focus:ring-accent/40"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditProject()
                            if (e.key === 'Escape') setEditingProject(null)
                          }}
                        />
                        <div className="flex items-center gap-1">
                          {PROJECT_COLORS.map((c) => (
                            <button
                              key={c}
                              onClick={() => setEditingProject({ ...editingProject, color: c })}
                              className={cn(
                                'w-4 h-4 rounded-full transition-all',
                                editingProject.color === c ? 'scale-125 ring-1 ring-white/30' : ''
                              )}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                          <div className="flex-1" />
                          <button onClick={saveEditProject} className="p-1 rounded hover:bg-accent/10 text-accent">
                            <Check size={12} />
                          </button>
                          <button onClick={() => setEditingProject(null)} className="p-1 rounded hover:bg-surface-300 text-neutral-500">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={p.$id}
                      onClick={() => { setActiveProject(p.$id); router.push('/app/projects') }}
                      className={cn(
                        'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-all group cursor-pointer',
                        isActive
                          ? 'bg-accent/10 text-accent'
                          : 'text-neutral-500 hover:bg-surface-300 hover:text-neutral-300'
                      )}
                    >
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="truncate flex-1 text-left">{p.name}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          aria-label={`Edit ${p.name}`}
                          onClick={(e) => { e.stopPropagation(); startEditProject(p) }}
                          className="p-1 rounded hover:bg-surface-400 text-neutral-600 hover:text-accent cursor-pointer"
                        >
                          <Pencil size={10} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${p.name}`}
                          onClick={(e) => { e.stopPropagation(); handleDeleteProject(p.$id) }}
                          className="p-1 rounded hover:bg-red-500/10 text-neutral-600 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  )
                })}

                {showNewProject ? (
                  <form onSubmit={handleCreateProject} className="mt-1">
                    <input
                      autoFocus
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Project name..."
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-surface-400 bg-surface-200 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-accent/40"
                      onBlur={() => { if (!newProjectName.trim()) setShowNewProject(false) }}
                      onKeyDown={(e) => { if (e.key === 'Escape') { setShowNewProject(false); setNewProjectName('') } }}
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => setShowNewProject(true)}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-neutral-600 hover:bg-surface-300 hover:text-accent transition-all"
                  >
                    <Plus size={12} />
                    New project
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Settings */}
          <Link href="/app/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
              isSettingsPage
                ? 'bg-accent/10 text-accent border border-accent/15 glow-green-sm'
                : 'text-neutral-500 hover:bg-surface-300 hover:text-neutral-200 border border-transparent'
            )}
          >
            <Settings size={16} className="shrink-0" />
            <span className="font-medium">Settings</span>
            {isSettingsPage && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />}
          </Link>

          <SidebarTimer />
        </nav>

        {/* User */}
        <div className="border-t border-white/[0.04] p-3 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <User size={13} className="text-accent" />
            </div>
            <span className="text-xs text-neutral-400 truncate flex-1">{user?.name || '...'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-600 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/10"
          >
            <LogOut size={14} className="shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-hidden flex flex-col relative z-10 pb-16 md:pb-0">
        {children}
      </main>

      {/* ===== MOBILE BOTTOM NAV (hidden on desktop) ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/[0.06] pb-safe">
        <div className="flex items-center justify-around px-4 h-14">
          <Link href="/app/parking"
            className={cn(
              'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all relative',
              isParkingPage ? 'text-accent' : 'text-neutral-600 active:text-neutral-400'
            )}
          >
            {isParkingPage && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-accent" />}
            <ParkingSquare size={20} />
            <span className="text-[10px] font-medium">Parking</span>
          </Link>
          <Link href="/app/projects"
            className={cn(
              'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all relative',
              isProjectsPage ? 'text-accent' : 'text-neutral-600 active:text-neutral-400'
            )}
          >
            {isProjectsPage && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-accent" />}
            <FolderKanban size={20} />
            <span className="text-[10px] font-medium">Projects</span>
          </Link>
          <Link href="/app/settings"
            className={cn(
              'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all relative',
              isSettingsPage ? 'text-accent' : 'text-neutral-600 active:text-neutral-400'
            )}
          >
            {isSettingsPage && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-accent" />}
            <Settings size={20} />
            <span className="text-[10px] font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-neutral-600 active:text-red-400 transition-all"
          >
            <LogOut size={20} />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
