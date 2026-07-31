'use client'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, GripVertical, ExternalLink } from 'lucide-react'
import type { StackItem, StackLane } from '@/types'
import { cn } from '@/lib/utils'
import { removeFromStack } from '@/lib/db'
import { useAppStore } from '@/store'

const LANE_COLORS: Record<StackLane, { border: string; dot: string; glow: string }> = {
  Frontend: { border: 'border-blue-500/20',   dot: 'bg-blue-400',   glow: 'shadow-blue-500/5' },
  Backend:  { border: 'border-green-500/20',  dot: 'bg-green-400',  glow: 'shadow-green-500/5' },
  Database: { border: 'border-amber-500/20',  dot: 'bg-amber-400',  glow: 'shadow-amber-500/5' },
  DevOps:   { border: 'border-orange-500/20', dot: 'bg-orange-400', glow: 'shadow-orange-500/5' },
  Auth:     { border: 'border-pink-500/20',   dot: 'bg-pink-400',   glow: 'shadow-pink-500/5' },
  Other:    { border: 'border-neutral-500/20', dot: 'bg-neutral-400', glow: 'shadow-neutral-500/5' },
}

function PlacedToolCard({ item }: { item: StackItem }) {
  const removeStackItem = useAppStore((s) => s.removeStackItem)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.$id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    willChange: isDragging ? 'transform, opacity' : 'auto',
  }

  async function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    try {
      await removeFromStack(item.$id)
      removeStackItem(item.$id)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to remove tool from stack')
    }
  }

  const tool = item.tool
  if (!tool) return null

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="group glass-card flex items-center gap-3 px-3 py-3 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-150 select-none">
      <GripVertical size={14} className="text-neutral-700 shrink-0 hidden md:block" />
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 font-medium overflow-hidden"
        style={{ backgroundColor: tool.color + '20', color: tool.color }}
      >
        {tool.icon?.startsWith('http') ? (
          <img src={tool.icon} alt="" className="w-5 h-5 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        ) : (
          tool.icon || tool.name[0]?.toUpperCase()
        )}
      </div>
      <span className="text-sm font-medium text-neutral-200 flex-1 truncate">{tool.name}</span>
      {tool.url && (
        <a href={tool.url} target="_blank" rel="noopener noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="text-neutral-700 hover:text-accent opacity-0 group-hover:opacity-100 transition-all shrink-0 p-1.5 hover:bg-surface-400 rounded-lg">
          <ExternalLink size={13} />
        </a>
      )}
      <button
        aria-label={`Remove ${tool.name} from stack`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleRemove}
        className="opacity-0 group-hover:opacity-100 text-neutral-700 hover:text-red-400 transition-all shrink-0 p-1.5 hover:bg-red-500/10 rounded-lg">
        <X size={13} />
      </button>
    </div>
  )
}

interface Props {
  lane: StackLane
  items: StackItem[]
}

export default function StackLaneComponent({ lane, items }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: `lane-${lane}` })
  const laneColor = LANE_COLORS[lane]

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-2xl border bg-surface-100/50 p-4 transition-all duration-200 min-h-[160px] flex flex-col',
        laneColor.border,
        isOver && 'border-accent/40 bg-accent/[0.03] glow-green-sm scale-[1.01]'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={cn('w-2 h-2 rounded-full', laneColor.dot)} />
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{lane}</span>
        <span className="ml-auto text-xs font-mono text-neutral-600 bg-surface-300 px-2 py-0.5 rounded-md">{items.length}</span>
      </div>

      <SortableContext items={items.map((i) => i.$id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1.5 flex-1">
          {items.map((item) => (
            <PlacedToolCard key={item.$id} item={item} />
          ))}
        </div>
      </SortableContext>

      {items.length === 0 && (
        <div className={cn(
          'flex items-center justify-center flex-1 rounded-xl border border-dashed text-xs font-medium transition-all py-6',
          isOver
            ? 'border-accent/40 text-accent bg-accent/[0.03]'
            : 'border-surface-500 text-neutral-700'
        )}>
          {isOver ? 'Drop here' : 'Drag tools here'}
        </div>
      )}
    </div>
  )
}
