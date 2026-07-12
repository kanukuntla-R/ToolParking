import PocketBase from 'pocketbase'
import { logger } from '@/lib/logger'

const POCKETBASE_URL = process.env.POCKETBASE_URL
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || ''
const REQUEST_TIMEOUT_MS = 8000

let adminClient: PocketBase | null = null
let authPromise: Promise<PocketBase> | null = null

function getPocketBaseUrl(): string {
  if (POCKETBASE_URL) return POCKETBASE_URL

  if (process.env.NODE_ENV === 'production') {
    throw new Error('POCKETBASE_URL is missing in the deployment environment')
  }

  return 'http://127.0.0.1:8090'
}

function configureClient(pb: PocketBase): PocketBase {
  pb.autoCancellation(false)
  pb.beforeSend = (url, options) => {
    const fetchWithTimeout: typeof fetch = async (requestUrl, requestOptions) => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

      try {
        return await fetch(requestUrl, {
          ...requestOptions,
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timeout)
      }
    }

    return {
      url,
      options: {
        ...options,
        fetch: fetchWithTimeout,
      },
    }
  }

  return pb
}

export async function getAdminClient(): Promise<PocketBase> {
  if (adminClient?.authStore.isValid) return adminClient

  if (authPromise) return authPromise

  authPromise = (async () => {
    const pocketBaseUrl = getPocketBaseUrl()
    const pb = configureClient(new PocketBase(pocketBaseUrl))

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
        `Check POCKETBASE_URL (${pocketBaseUrl}), POCKETBASE_ADMIN_EMAIL, and POCKETBASE_ADMIN_PASSWORD. ` +
        `Ensure PocketBase is running and the admin account exists.`
      )
    }

    adminClient = pb
    return pb
  })()

  return authPromise
}

export const pb = configureClient(new PocketBase(getPocketBaseUrl()))
