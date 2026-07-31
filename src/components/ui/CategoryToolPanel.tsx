'use client'
import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, Plus, Search, GripVertical } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import type { Tool, ToolCategory } from '@/types'
import { CATEGORY_LABELS, cn } from '@/lib/utils'

const CATEGORIES: ToolCategory[] = ['frontend', 'backend', 'database', 'devops', 'auth', 'ui', 'testing', 'monitoring', 'skills', 'tools', 'open-source', 'other']

interface DraggableToolProps {
  tool: Tool
  onSelect: (tool: Tool) => void
}

function DraggableToolItem({ tool, onSelect }: DraggableToolProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: tool.$id })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(tool)}
      className={cn(
        'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-neutral-400 hover:bg-surface-300 hover:text-white transition-all group cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50'
      )}
    >
      <GripVertical size={12} className="text-neutral-700 shrink-0 hidden md:block" />
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-medium shrink-0 overflow-hidden"
        style={{ backgroundColor: tool.color + '20', color: tool.color }}
      >
        {tool.icon?.startsWith('http') ? (
          <img src={tool.icon} alt="" className="w-4 h-4 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        ) : (
          tool.icon || tool.name[0]?.toUpperCase()
        )}
      </div>
      <span className="truncate flex-1 text-left">{tool.name}</span>
      <Plus size={12} className="text-neutral-700 group-hover:text-accent transition-colors shrink-0" />
    </div>
  )
}

interface Props {
  tools: Tool[]
  onSelect: (tool: Tool) => void
}

export default function CategoryToolPanel({ tools, onSelect }: Props) {
  const [expandedCats, setExpandedCats] = useState<Set<ToolCategory>>(new Set())
  const [search, setSearch] = useState('')

  const categorized = useMemo(() => {
    const map = new Map<ToolCategory, Tool[]>()
    CATEGORIES.forEach((c) => map.set(c, []))
    tools.forEach((t) => {
      const cats = t.categories || ['other']
      cats.forEach((cat) => {
        if (!map.has(cat)) map.set(cat, [])
        if (!map.get(cat)!.some((existing) => existing.$id === t.$id)) {
          map.get(cat)!.push(t)
        }
      })
    })
    return map
  }, [tools])

  const filtered = useMemo(() => {
    if (!search.trim()) return categorized
    const q = search.toLowerCase()
    const map = new Map<ToolCategory, Tool[]>()
    CATEGORIES.forEach((c) => map.set(c, []))
    tools.forEach((t) => {
      if (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q))) {
        const cats = t.categories || ['other']
        cats.forEach((cat) => {
          if (!map.has(cat)) map.set(cat, [])
          if (!map.get(cat)!.some((existing) => existing.$id === t.$id)) {
            map.get(cat)!.push(t)
          }
        })
      }
    })
    return map
  }, [tools, search, categorized])

  const activeCategories = CATEGORIES.filter((c) => (filtered.get(c) || []).length > 0)

  function toggleCat(cat: ToolCategory) {
    setExpandedCats((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  function expandAll() {
    setExpandedCats(new Set(activeCategories))
  }

  function collapseAll() {
    setExpandedCats(new Set())
  }

  const allOpen = activeCategories.length > 0 && activeCategories.every((c) => expandedCats.has(c))

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-surface-400 bg-surface-200 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-all"
          />
        </div>
      </div>

      {/* Expand / Collapse toggle */}
      <div className="flex items-center justify-between px-4 pb-2">
        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Categories</p>
        <button
          onClick={allOpen ? collapseAll : expandAll}
          className="text-[10px] text-neutral-500 hover:text-accent transition-colors font-medium"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3 space-y-1">
        {activeCategories.map((cat) => {
          const items = filtered.get(cat) || []
          const isExpanded = expandedCats.has(cat)

          return (
            <div key={cat} className="rounded-xl border border-white/[0.04] overflow-hidden">
              {/* Category header */}
              <button
                onClick={() => toggleCat(cat)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-surface-300 transition-colors"
              >
                {isExpanded ? <ChevronDown size={12} className="text-neutral-500" /> : <ChevronRight size={12} className="text-neutral-500" />}
                <span className="flex-1 text-left">{CATEGORY_LABELS[cat]}</span>
                <span className="text-[10px] font-mono text-neutral-600 bg-surface-400 px-1.5 py-0.5 rounded-md">{items.length}</span>
              </button>

              {/* Tools under category */}
              {isExpanded && (
                <div className="px-2 pb-2 space-y-0.5">
                  {items.map((tool) => (
                    <DraggableToolItem key={tool.$id} tool={tool} onSelect={onSelect} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
        {activeCategories.length === 0 && (
          <div className="px-3 py-8 text-center text-xs text-neutral-600">No tools found</div>
        )}
      </div>
    </div>
  )
}
