'use client'
import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'system'

interface Props {
  compact?: boolean
}

export function ThemeSwitcher({ compact = false }: Props) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (!isDark) root.classList.add('light')
    } else if (theme === 'light') {
      root.classList.add('light')
    }
    // 'dark' = no class added (default dark theme)

    localStorage.setItem('theme', theme)
  }, [theme])

  const options: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ]

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-200 border border-white/[0.04]">
        {options.map(({ value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
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
