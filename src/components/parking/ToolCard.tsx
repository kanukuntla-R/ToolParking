'use client'
import { ExternalLink, Trash2, GripVertical, Pencil, Globe } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Tool } from '@/types'
import { CATEGORY_LABELS, CATEGORY_COLORS, cn } from '@/lib/utils'
import { deleteTool } from '@/lib/db'
import { useAppStore } from '@/store'

interface Props {
  tool: Tool
  draggable?: boolean
  onEdit?: (tool: Tool) => void
}

export default function ToolCard({ tool, draggable = true, onEdit }: Props) {
  const removeTool = useAppStore((s) => s.removeTool)
  const user = useAppStore((s) => s.user)
  const isOwner = user?.$id === tool.userId
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tool.$id, disabled: !draggable })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const catColor = CATEGORY_COLORS[tool.category]

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    removeTool(tool.$id)
    try { await deleteTool(tool.$id) } catch {}
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation()
    onEdit?.(tool)
  }

  return (
    <div
      ref={setNodeRef} style={style}
      className={cn(
        'group glass-card flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-grab active:cursor-grabbing',
        isDragging && 'glow-green'
      )}
    >
      {/* Drag handle — desktop only */}
      <div {...attributes} {...listeners} className="hidden md:block text-neutral-700 hover:text-accent transition-colors shrink-0">
        <GripVertical size={14} />
      </div>

      {/* Icon */}
      <div
        className="w-9 h-9 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-sm shrink-0 font-medium overflow-hidden"
        style={{ backgroundColor: tool.color + '20', color: tool.color }}
      >
        {tool.icon?.startsWith('http') ? (
          <img src={tool.icon} alt="" className="w-5 h-5 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        ) : (
          tool.icon || tool.name[0]?.toUpperCase()
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-100 break-words">{tool.name}</span>
          {tool.url && (
            <a href={tool.url} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-neutral-500 hover:text-accent opacity-0 group-hover:opacity-100 transition-all shrink-0">
              <ExternalLink size={11} />
            </a>
          )}
        </div>
        {tool.description && (
          <p className="text-xs text-neutral-500 break-words mt-0.5 line-clamp-2">{tool.description}</p>
        )}
      </div>

      {/* Category tag */}
      <span className={cn('hidden md:inline text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0', catColor.bg, catColor.text)}>
        {CATEGORY_LABELS[tool.category]}
      </span>

      {/* Public badge */}
      {tool.isPublic && (
        <span className={cn(
          'hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 border',
          isOwner
            ? 'bg-accent/10 text-accent border-accent/15'
            : 'bg-accent/5 text-accent/50 border-accent/10'
        )}>
          <Globe size={9} />
          {isOwner ? 'Public' : 'Shared'}
        </span>
      )}

      {/* Edit — only if owner */}
      {isOwner && (
        <button
          onClick={handleEdit}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-surface-400 text-neutral-600 hover:text-accent transition-all shrink-0"
        >
          <Pencil size={13} />
        </button>
      )}

      {/* Delete — only if owner */}
      {isOwner && (
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-600 hover:text-red-400 transition-all shrink-0"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  )
}
