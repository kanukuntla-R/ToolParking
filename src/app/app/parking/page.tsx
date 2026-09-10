'use client'
import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, RefreshCw, Search } from 'lucide-react'
import { getTools } from '@/lib/db'
import { useAppStore } from '@/store'
import { CATEGORY_LABELS, cn } from '@/lib/utils'
import ToolCard from '@/components/parking/ToolCard'
import AddToolModal from '@/components/parking/AddToolModal'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import type { Tool, ToolCategory } from '@/types'

const FILTERS = [
  { value: 'all',        label: 'All' },
  { value: 'mine',       label: 'Mine' },
  { value: 'frontend',   label: 'Frontend' },
  { value: 'ui',         label: 'UI' },
  { value: 'backend',    label: 'Backend' },
  { value: 'database',   label: 'Database' },
  { value: 'devops',     label: 'DevOps' },
  { value: 'auth',       label: 'Auth' },
  { value: 'testing',    label: 'Testing' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'skills',     label: 'Skills' },
  { value: 'tools',      label: 'Tools' },
  { value: 'open-source', label: 'Open source' },
  { value: 'other',      label: 'Other' },
]

export default function ParkingPage() {
  const { user, tools, setTools, searchQuery, setSearchQuery, activeFilter, setActiveFilter } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const [editingTool, setEditingTool] = useState<Tool | null>(null)

  const { data: fetchedTools, error, isError, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['tools', user?.$id],
    queryFn:  () => getTools(user!.$id),
    enabled:  !!user,
  })

  useEffect(() => {
    if (fetchedTools) setTools(fetchedTools)
  }, [fetchedTools, setTools])

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      let matchCat = true
      if (activeFilter === 'mine') {
        matchCat = !t.isDefault
      } else if (activeFilter !== 'all') {
        matchCat = t.categories?.includes(activeFilter as ToolCategory) ?? false
      }
      const q = searchQuery.toLowerCase()
      const matchSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q))
      return matchCat && matchSearch
    })
  }, [tools, activeFilter, searchQuery])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="app-header flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/[0.04] glass shrink-0">
        <div>
          <h1 className="text-base font-semibold text-white">Tool Parking</h1>
          <p className="text-xs text-neutral-600 mt-0.5 font-mono">{tools.length} tools parked</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher compact />
          {/* Desktop add button */}
          <button
            onClick={() => setShowModal(true)}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-black text-xs font-semibold hover:bg-accent-500 transition-all"
          >
            <Plus size={14} />
            Add tool
          </button>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="px-4 md:px-6 py-3 border-b border-white/[0.04] space-y-3 shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools, tags..."
            className="w-full pl-8 pr-4 py-2.5 md:py-2 text-sm rounded-xl border border-surface-400 bg-surface-200 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/30 transition-all"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-0.5 -mx-1 px-1">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-lg border whitespace-nowrap transition-all shrink-0',
                activeFilter === value
                  ? 'bg-accent/15 text-accent border-accent/25'
                  : 'border-surface-400 text-neutral-600 hover:border-surface-600 hover:text-neutral-400'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tool list/grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-6 py-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-surface-200 animate-pulse border border-white/[0.02]" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-56 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <span className="text-xl text-red-300">!</span>
            </div>
            <p className="text-sm font-medium text-neutral-200">Could not load tools</p>
            <p className="text-xs text-neutral-600 mt-1 max-w-md">
              {error instanceof Error ? error.message : 'The tools API did not respond. Check the database connection.'}
            </p>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-4 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-200 border border-surface-400 text-neutral-300 text-xs font-semibold hover:border-accent/30 hover:text-white disabled:opacity-50 transition-all"
            >
              <RefreshCw size={13} className={cn(isFetching && 'animate-spin')} />
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center mb-4">
              <span className="text-2xl">P</span>
            </div>
            <p className="text-sm font-medium text-neutral-300">
              {tools.length === 0 ? 'Parking lot is empty' : 'No tools match your search'}
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              {tools.length === 0 ? 'Add your first tool to get started' : 'Try a different filter or search term'}
            </p>
            {tools.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-black text-xs font-semibold hover:bg-accent-500 transition-all"
              >
                <Plus size={13} />
                Add first tool
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.$id} tool={tool} onEdit={(t) => setEditingTool(t)} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile floating add button */}
      <button
        onClick={() => setShowModal(true)}
        className="md:hidden fixed right-4 bottom-20 w-14 h-14 rounded-2xl bg-accent text-black flex items-center justify-center shadow-lg glow-green active:scale-95 transition-transform z-40"
      >
        <Plus size={24} />
      </button>

      {showModal && <AddToolModal onClose={() => setShowModal(false)} />}
      {editingTool && <AddToolModal editTool={editingTool} onClose={() => setEditingTool(null)} />}
    </div>
  )
}
