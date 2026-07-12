import PocketBase from 'pocketbase'
import { logger } from '@/lib/logger'

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || ''

let adminClient: PocketBase | null = null
let authPromise: Promise<PocketBase> | null = null

export async function getAdminClient(): Promise<PocketBase> {
  if (adminClient?.authStore.isValid) return adminClient

  if (authPromise) return authPromise

  authPromise = (async () => {
    const pb = new PocketBase(POCKETBASE_URL)
    pb.autoCancellation(false)

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        'PocketBase admin credentials missing. Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD in .env.local'
      )
    }

    try {
      // PocketBase 0.27+ uses _superusers collection for admin auth
      await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
      logger.info('PB', `Authenticated as superuser (${ADMIN_EMAIL})`)
    } catch (err: any) {
      authPromise = null
      logger.error('PB', 'PocketBase auth failed', err)
      const errorMsg = err?.message || 'Unknown error'
      throw new Error(
        `PocketBase authentication failed: ${errorMsg}. ` +
        `Check POCKETBASE_URL (${POCKETBASE_URL}), POCKETBASE_ADMIN_EMAIL, and POCKETBASE_ADMIN_PASSWORD. ` +
        `Ensure PocketBase is running and the admin account exists.`
      )
    }

    adminClient = pb
    return pb
  })()

  return authPromise
}

export const pb = new PocketBase(POCKETBASE_URL).autoCancellation(false)
