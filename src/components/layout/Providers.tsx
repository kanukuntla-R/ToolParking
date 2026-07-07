'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store'
import { getCurrentUser } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { Agentation } from 'agentation'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

function AuthBootstrap() {
  const setUser = useAppStore((s) => s.setUser)
  const ran = useRef(false)
  useEffect(() => {
    if (ran.current) return
    ran.current = true
    logger.info('BOOT', 'Auth bootstrap starting...')
    getCurrentUser().then((user) => {
      setUser(user)
      logger.info('BOOT', `User set: ${user?.name ?? 'null'}`)
      // Seed default tools via API
      if (user) {
        fetch('/api/seed', { method: 'POST' })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              logger.info('BOOT', 'Default tools seeded')
            }
          })
          .catch((err) => {
            logger.error('BOOT', 'Failed to seed default tools', err)
          })
      }
    })
  }, [setUser])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      {children}
      <Agentation />
    </QueryClientProvider>
  )
}
