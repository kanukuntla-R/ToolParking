'use client'
import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createProject } from '@/lib/db'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

const PALETTE = ['#22c55e','#3b82f6','#a855f7','#f43f5e','#f97316','#06b6d4','#eab308','#64748b']

interface Props { onClose: () => void }

export default function CreateProjectModal({ onClose }: Props) {
  const { user, addProject, setActiveProject } = useAppStore()
  const [name, setName]           = useState('')
  const [description, setDesc]    = useState('')
  const [color, setColor]         = useState(PALETTE[0])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const project = await createProject(user.$id, { name, description, color })
      addProject(project)
      setActiveProject(project.$id)
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="glass rounded-t-2xl md:rounded-2xl border border-white/[0.06] w-full max-w-sm animate-slide-up glow-green-sm">
        {/* Mobile drag indicator */}
        <div className="md:hidden flex justify-center pt-3">
          <div className="w-8 h-1 rounded-full bg-surface-500" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
          <h2 className="text-sm font-semibold text-white">New project</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-400 text-neutral-500 transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Project name *</label>
            <input
              required autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SaaS dashboard"
              className="w-full px-3 py-3 md:py-2.5 text-sm rounded-xl border border-surface-400 bg-surface-200 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description</label>
            <input
              value={description} onChange={(e) => setDesc(e.target.value)}
              placeholder="Optional short description"
              className="w-full px-3 py-3 md:py-2.5 text-sm rounded-xl border border-surface-400 bg-surface-200 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2">Color</label>
            <div className="flex gap-2.5 flex-wrap">
              {PALETTE.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all border-2',
                    color === c
                      ? 'scale-110 border-white/30 shadow-lg'
                      : 'border-transparent hover:scale-105 opacity-70 hover:opacity-100'
                  )}
                  style={{ backgroundColor: c, boxShadow: color === c ? `0 0 12px ${c}40` : undefined }}
                />
              ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-3 md:py-2.5 rounded-xl border border-surface-400 text-sm text-neutral-400 hover:bg-surface-300 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 rounded-xl bg-accent text-black text-sm font-semibold hover:bg-accent-500 disabled:opacity-50 transition-all">
              {loading && <Loader2 size={13} className="animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
