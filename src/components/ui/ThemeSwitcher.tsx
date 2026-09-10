'use client'
import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'system' | 'pixel-drift'

interface Props {
  compact?: boolean
}

export function ThemeSwitcher({ compact = false }: Props) {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    setTheme(saved ?? 'dark')
  }, [])

  useEffect(() => {
    if (!theme) return
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      root.classList.remove('light', 'pixel-drift')
      if (theme === 'pixel-drift') root.classList.add('pixel-drift')
      else if (theme === 'light' || (theme === 'system' && !media.matches)) root.classList.add('light')
    }

    applyTheme()
    localStorage.setItem('theme', theme)

    if (theme !== 'system') return
    media.addEventListener('change', applyTheme)
    return () => media.removeEventListener('change', applyTheme)
  }, [theme])

  const options: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'pixel-drift', icon: Sparkles, label: 'Pixel Drift' },
  ]

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-200 border border-white/[0.04]">
        {options.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-label={`${label} theme`}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all',
              theme === value
                ? 'bg-surface-300 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-300'
            )}
            title={value}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-200 border border-white/[0.04]">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={`${label} theme`}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
            theme === value
              ? 'bg-surface-300 text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-300'
          )}
          title={label}
        >
          <Icon size={14} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}

export default ThemeSwitcher
