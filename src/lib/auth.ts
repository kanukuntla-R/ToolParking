import type { AppUser } from '@/types'
import { logger } from './logger'

export async function getCurrentUser(): Promise<AppUser | null> {
  // Auth is handled by Clerk middleware — this is only a fallback
  return null
}

export async function logout(): Promise<void> {
  logger.info('AUTH', 'logout called')
  // Clerk sign-out is handled client-side via useClerk().signOut()
  // This function is a no-op here; the actual sign-out happens in the layout component
}
