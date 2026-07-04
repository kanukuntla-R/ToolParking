import type { AppUser } from '@/types'
import { logger } from './logger'

const DEV_USER: AppUser = { $id: 'dev-user', name: 'Dev User', email: 'dev@local.test' }

export async function getCurrentUser(): Promise<AppUser | null> {
  logger.info('AUTH', `getCurrentUser → ${DEV_USER.name} (${DEV_USER.$id})`)
  return DEV_USER
}

export async function login(_email: string, _password: string): Promise<void> {
  logger.info('AUTH', 'login (mock) — auto-authenticated as dev-user')
}

export async function signup(_name: string, _email: string, _password: string): Promise<void> {
  logger.info('AUTH', 'signup (mock) — auto-authenticated as dev-user')
}

export async function logout(): Promise<void> {
  logger.info('AUTH', 'logout (mock) — no-op in dev mode')
}

export async function loginWithGitHub(): Promise<void> {
  logger.info('AUTH', 'loginWithGitHub (mock) — no-op in dev mode')
}
