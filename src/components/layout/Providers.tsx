'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useAppStore } from '@/store'
import { logger } from '@/lib/logger'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

function AuthBootstrap() {
  const setUser = useAppStore((s) => s.setUser)
  const { user: clerkUser, isLoaded } = useUser()
  useEffect(() => {
    if (!isLoaded || !clerkUser) return
    
    const appUser = {
      $id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress || 'User',
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
    }
    
    setUser(appUser)
    logger.info('BOOT', `User set: ${appUser.name} (${appUser.$id})`)
  }, [isLoaded, clerkUser, setUser])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      {children}
    </QueryClientProvider>
  )
}
