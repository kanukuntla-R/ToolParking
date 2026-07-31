'use client'
import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { X, Loader2, ExternalLink, Link, Image as ImageIcon, Palette } from 'lucide-react'
import { createTool, updateTool } from '@/lib/db'
import { useAppStore } from '@/store'
import { CATEGORY_LABELS, cn } from '@/lib/utils'
import type { Tool, ToolCategory, ToolDraft } from '@/types'

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [ToolCategory, string][]

const ICON_SOURCES = ['google', 'duckduckgo', 'clearbit', 'custom'] as const
type IconSource = typeof ICON_SOURCES[number]

function getFaviconUrl(url: string, source: IconSource): string {
  if (!url) return ''
  try {
    const domain = new URL(url).hostname
    switch (source) {
      case 'google':      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      case 'duckduckgo':  return `https://icons.duckduckgo.com/ip3/${domain}.ico`
      case 'clearbit':    return `https://logo.clearbit.com/${domain}`
      default:            return ''
    }
  } catch { return '' }
}

interface Props { onClose: () => void; editTool?: Tool }

export default function AddToolModal({ onClose, editTool }: Props) {
  const { user, addTool, updateTool: updateToolInStore } = useAppStore()
  const queryClient = useQueryClient()
  const isEditing = !!editTool
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState<ToolDraft>({
    name:        editTool?.name ?? '',
    description: editTool?.description ?? '',
    categories:  editTool?.categories ?? ['other'],
    url:         editTool?.url ?? '',
    icon:        editTool?.icon ?? '',
    color:       editTool?.color ?? '#22c55e',
    tags:        Array.isArray(editTool?.tags) ? editTool.tags : [],
    isPublic:    editTool?.isPublic ?? false,
  })
  const [tagInput, setTagInput] = useState('')
  const [iconSource, setIconSource] = useState<IconSource>(editTool?.icon ? 'custom' : 'google')
  const [customIconUrl, setCustomIconUrl] = useState(editTool?.icon?.startsWith('http') ? editTool.icon : '')

  const resolvedIcon = useMemo(() => {
    if (iconSource === 'custom') return customIconUrl
    return getFaviconUrl(form.url, iconSource)
  }, [form.url, iconSource, customIconUrl])
  const hostname = useMemo(() => {
    try { return new URL(form.url).hostname } catch { return '' }
  }, [form.url])

  function set<K extends keyof ToolDraft>(k: K, v: ToolDraft[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function addTag(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase().replace(/,/g, '')
      if (!form.tags.includes(tag)) set('tags', [...form.tags, tag])
      setTagInput('')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError('')
    setLoading(true)
    try {
      const finalForm = { ...form, icon: resolvedIcon }
      if (isEditing) {
        const updated = await updateTool(editTool.$id, finalForm)
        queryClient.setQueryData<Tool[]>(['tools', user.$id], (current = []) =>
          current.map((tool) => tool.$id === updated.$id ? updated : tool)
        )
        updateToolInStore(updated)
      } else {
        const tool = await createTool(user.$id, finalForm)
        queryClient.setQueryData<Tool[]>(['tools', user.$id], (current = []) => {
          if (current.some((existing) => existing.$id === tool.$id)) return current
          return [tool, ...current]
        })
        addTool(tool)
      }
      queryClient.invalidateQueries({ queryKey: ['tools', user.$id] })
      onClose()
    } catch (err: any) {
      setError(err?.message || (isEditing ? 'Failed to update tool' : 'Failed to add tool'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="rounded-t-2xl md:rounded-2xl border border-white/[0.06] w-full max-w-md animate-slide-up overflow-hidden glow-green-sm max-h-[92vh] md:max-h-[85vh] flex flex-col bg-surface-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04] shrink-0">
          <h2 className="text-sm font-semibold text-neutral-100">{isEditing ? 'Edit tool' : 'Add tool to parking'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-200 text-neutral-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Mobile drag indicator */}
        <div className="md:hidden flex justify-center py-2 shrink-0">
          <div className="w-8 h-1 rounded-full bg-surface-400" />
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto scrollbar-thin flex-1">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Name *</label>
            <input
              required value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Next.js"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-300 bg-surface-200 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
            />
          </div>

          {/* Icon section */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Icon</label>
            {/* Preview */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-neutral-300 bg-surface-200 overflow-hidden">
                {resolvedIcon ? (
                  <img src={resolvedIcon} alt="icon" className="w-8 h-8 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <span className="text-lg font-bold" style={{ color: form.color }}>
                    {form.name ? form.name[0].toUpperCase() : '?'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-500 truncate">{resolvedIcon || 'No icon — enter a URL below'}</p>
              </div>
            </div>

            {/* Icon source selector */}
            <div className="flex gap-1.5 mb-2">
              {[
                { id: 'google' as const, label: 'Google', icon: <Link size={11} /> },
                { id: 'duckduckgo' as const, label: 'DDG', icon: <Link size={11} /> },
                { id: 'clearbit' as const, label: 'Clearbit', icon: <ImageIcon size={11} /> },
                { id: 'custom' as const, label: 'Custom', icon: <Palette size={11} /> },
              ].map((s) => (
                <button
                  key={s.id} type="button"
                  onClick={() => setIconSource(s.id)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 text-[10px] rounded-lg border transition-all font-medium',
                    iconSource === s.id
                      ? 'bg-accent/15 text-accent border-accent/30'
                      : 'border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-800'
                  )}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>

            {/* Custom icon URL input */}
            {iconSource === 'custom' && (
              <input
                value={customIconUrl} onChange={(e) => setCustomIconUrl(e.target.value)}
                placeholder="https://example.com/icon.png"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-surface-200 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
              />
            )}

            {iconSource !== 'custom' && hostname && (
              <p className="text-[10px] text-neutral-500">
                Auto-fetched from <span className="text-neutral-400">{hostname}</span>
              </p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color" value={form.color} onChange={(e) => set('color', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300 bg-surface-200"
              />
              <span className="text-xs text-neutral-500 font-mono">{form.color}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description</label>
            <input
              value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="What does this tool do?"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-300 bg-surface-200 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">URL</label>
            <div className="relative">
              <input
                type="url" value={form.url} onChange={(e) => set('url', e.target.value)}
                placeholder="https://... (icon auto-fetches from domain)"
                className="w-full pl-3 pr-8 py-2.5 text-sm rounded-xl border border-surface-400 bg-surface-200 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
              />
              <ExternalLink size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2">Category <span className="text-neutral-500 font-normal">(multi-select)</span></label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(([val, label]) => {
                const isSelected = form.categories.includes(val)
                return (
                  <button
                    key={val} type="button"
                    onClick={() => {
                      const next = isSelected
                        ? form.categories.filter((c) => c !== val)
                        : [...form.categories, val]
                      set('categories', next.length > 0 ? next : ['other'])
                    }}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-lg border transition-all',
                      isSelected
                        ? 'bg-accent/15 text-accent border-accent/30'
                        : 'border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-800'
                    )}
                  >{label}</button>
                )
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {form.tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-accent/10 rounded-lg text-accent/80 border border-accent/10">
                  {t}
                  <button type="button" onClick={() => set('tags', form.tags.filter((x) => x !== t))}
                    className="text-accent/40 hover:text-accent">×</button>
                </span>
              ))}
            </div>
            <input
              value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag}
              placeholder="Type tag and press Enter"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-300 bg-surface-200 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
            />
          </div>

          {/* Public toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only peer"
                checked={form.isPublic} onChange={(e) => set('isPublic', e.target.checked)} />
              <div className="w-9 h-5 rounded-full bg-surface-400 peer-checked:bg-accent/30 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-neutral-500 peer-checked:bg-accent transition-all peer-checked:translate-x-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-300">Make public</p>
              <p className="text-xs text-neutral-500">Visible to all Tool Parking users</p>
            </div>
          </label>

          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-3 md:py-2.5 rounded-xl border border-neutral-300 text-sm text-neutral-600 hover:bg-surface-200 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 rounded-xl bg-accent text-black text-sm font-semibold hover:bg-accent-500 disabled:opacity-50 transition-all">
              {loading && <Loader2 size={13} className="animate-spin" />}
              {isEditing ? 'Save changes' : 'Park tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
