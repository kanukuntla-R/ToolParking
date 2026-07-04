'use client'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store'
import { User, Palette, Database, Trash2, Check, Info, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/logger'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

const THEME_ACCENTS = [
  { name: 'Green',  value: '#22c55e' },
  { name: 'Blue',   value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Red',    value: '#f43f5e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Cyan',   value: '#06b6d4' },
  { name: 'Yellow', value: '#eab308' },
]

interface ProfileData {
  name: string
  email: string
}

export default function SettingsPage() {
  const { user, setUser } = useAppStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'data'>('profile')
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({ name: user?.name ?? '', email: user?.email ?? '' })
  const [accentColor, setAccentColor] = useState('#22c55e')

  useEffect(() => {
    const savedAccent = localStorage.getItem('accent-color')
    if (savedAccent) setAccentColor(savedAccent)
  }, [])

  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem('user-profile')
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile)
          setProfile({ name: parsed.name, email: parsed.email })
          // Only update if different to avoid infinite loop
          if (parsed.name !== user.name || parsed.email !== user.email) {
            setUser(parsed)
          }
        } catch {}
      } else {
        setProfile({ name: user.name, email: user.email })
      }
    }
  }, [user?.$id])

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'data' as const, label: 'Data', icon: Database },
  ]

  function handleSave() {
    if (user) {
      const updatedUser = { ...user, name: profile.name, email: profile.email }
      setUser(updatedUser)
      localStorage.setItem('user-profile', JSON.stringify(updatedUser))
      logger.info('SETTINGS', `Profile saved: ${profile.name}`)
    }
    localStorage.setItem('accent-color', accentColor)
    document.documentElement.style.setProperty('--accent', hexToRgb(accentColor))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '34 197 94'
    return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
  }

  function handleClearData() {
    if (!confirm('Clear all local data? This cannot be undone.')) return
    localStorage.clear()
    logger.warn('SETTINGS', 'All local data cleared')
    window.location.reload()
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/[0.04] glass shrink-0">
        <div>
          <h1 className="text-base font-semibold text-white">Settings</h1>
          <p className="text-xs text-neutral-600 mt-0.5">Manage your preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all',
            saved
              ? 'bg-accent/20 text-accent border border-accent/30'
              : 'bg-accent text-black hover:bg-accent-500'
          )}
        >
          <Check size={13} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-6 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl bg-surface-200 border border-white/[0.04]">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all',
                  activeTab === id
                    ? 'bg-surface-300 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-300'
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">User Profile</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Name</label>
                    <input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-surface-400 bg-surface-200 text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Email</label>
                    <input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-surface-400 bg-surface-200 text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">User ID</label>
                    <input
                      value={user?.$id ?? ''}
                      readOnly
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-surface-400 bg-surface-300 text-neutral-500 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Theme</h3>
                <ThemeSwitcher />
              </div>

              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Accent Color</h3>
                <div className="flex gap-3 flex-wrap">
                  {THEME_ACCENTS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setAccentColor(c.value)}
                      className={cn(
                        'w-10 h-10 rounded-xl transition-all border-2 hover:scale-110',
                        accentColor === c.value ? 'border-white/30 scale-110' : 'border-transparent'
                      )}
                      style={{ backgroundColor: c.value, boxShadow: `0 0 12px ${c.value}40` }}
                      title={c.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-surface-400 bg-surface-200"
                  />
                  <span className="text-xs font-mono text-neutral-500">{accentColor}</span>
                </div>
              </div>

              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Font</h3>
                <p className="text-xs text-neutral-500">Currently using Geist Mono (monospace)</p>
                <div className="p-3 rounded-lg bg-surface-300 border border-white/[0.04]">
                  <p className="text-sm text-neutral-300 font-mono">The quick brown fox jumps over the lazy dog</p>
                  <p className="text-xs text-neutral-500 mt-1 font-mono">0123456789 !@#$%^&*()</p>
                </div>
              </div>
            </div>
          )}

          {/* Data */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Local Storage</h3>
                <p className="text-xs text-neutral-500">
                  Tool Parking stores all data locally in your browser. No data is sent to external servers in dev mode.
                </p>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Info size={14} className="text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-300">Clearing data will remove all tools, projects, and stack items.</p>
                </div>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={13} />
                  Clear all local data
                </button>
              </div>

              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">About</h3>
                <div className="space-y-2 text-xs text-neutral-500">
                  <div className="flex justify-between">
                    <span>Version</span>
                    <span className="font-mono text-neutral-400">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>React</span>
                    <span className="font-mono text-neutral-400">19.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next.js</span>
                    <span className="font-mono text-neutral-400">15.5.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span className="font-mono text-neutral-400">localStorage</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
