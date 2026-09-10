import type { ToolCategory, StackLane } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Maps a tool's first category to the stack lane it belongs in
export function getCategoryLane(categories: ToolCategory[]): StackLane {
  const first = categories?.[0] || 'other'
  return CATEGORY_TO_LANE[first] || 'Other'
}

export const CATEGORY_TO_LANE: Record<ToolCategory, StackLane> = {
  frontend:   'Frontend',
  ui:         'Frontend',
  backend:    'Backend',
  database:   'Database',
  devops:     'DevOps',
  auth:       'Auth',
  testing:    'Other',
  monitoring: 'Other',
  skills:     'Other',
  tools:      'Other',
  'open-source': 'Other',
  other:      'Other',
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  frontend:   'Frontend',
  ui:         'UI lib',
  backend:    'Backend',
  database:   'Database',
  devops:     'DevOps',
  auth:       'Auth',
  testing:    'Testing',
  monitoring: 'Monitoring',
  skills:     'Skills',
  tools:      'Tools',
  'open-source': 'Open source',
  other:      'Other',
}

export const CATEGORY_COLORS: Record<ToolCategory, { bg: string; text: string }> = {
  frontend:   { bg: 'bg-blue-500/10',   text: 'text-blue-400' },
  ui:         { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  backend:    { bg: 'bg-green-500/10',  text: 'text-green-400' },
  database:   { bg: 'bg-amber-500/10',  text: 'text-amber-400' },
  devops:     { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  auth:       { bg: 'bg-pink-500/10',   text: 'text-pink-400' },
  testing:    { bg: 'bg-cyan-500/10',   text: 'text-cyan-400' },
  monitoring: { bg: 'bg-red-500/10',    text: 'text-red-400' },
  skills:     { bg: 'bg-violet-500/10', text: 'text-violet-400' },
  tools:      { bg: 'bg-lime-500/10',   text: 'text-lime-400' },
  'open-source': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  other:      { bg: 'bg-neutral-500/10', text: 'text-neutral-400' },
}

export const ALL_LANES: StackLane[] = ['Frontend', 'Backend', 'Database', 'DevOps', 'Auth', 'Other']
