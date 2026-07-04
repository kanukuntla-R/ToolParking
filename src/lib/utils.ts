import type { ToolCategory, StackLane } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Maps a tool category to the stack lane it belongs in
export const CATEGORY_TO_LANE: Record<ToolCategory, StackLane> = {
  frontend:   'Frontend',
  ui:         'Frontend',
  backend:    'Backend',
  database:   'Database',
  devops:     'DevOps',
  auth:       'Auth',
  testing:    'Other',
  monitoring: 'Other',
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
  other:      { bg: 'bg-neutral-500/10', text: 'text-neutral-400' },
}

export const ALL_LANES: StackLane[] = ['Frontend', 'Backend', 'Database', 'DevOps', 'Auth', 'Other']

export const SEED_TOOLS = [
  { name: 'Next.js',       description: 'React framework for production', category: 'frontend' as ToolCategory,  url: 'https://nextjs.org',       icon: '▲', color: '#000000', tags: ['react', 'ssr', 'vercel'], isPublic: true },
  { name: 'Tailwind CSS',  description: 'Utility-first CSS framework',    category: 'ui' as ToolCategory,        url: 'https://tailwindcss.com',  icon: '◈', color: '#06B6D4', tags: ['css', 'styling'],         isPublic: true },
  { name: 'Supabase',      description: 'Open source Firebase alternative', category: 'backend' as ToolCategory, url: 'https://supabase.com',     icon: '⬡', color: '#3ECF8E', tags: ['postgres', 'realtime'],   isPublic: true },
  { name: 'Appwrite',      description: 'Backend platform for developers', category: 'backend' as ToolCategory,  url: 'https://appwrite.io',      icon: 'A', color: '#FD366E', tags: ['baaS', 'auth', 'storage'], isPublic: true },
  { name: 'Drizzle ORM',   description: 'TypeScript ORM',                 category: 'database' as ToolCategory,  url: 'https://orm.drizzle.team', icon: '◆', color: '#C5F74F', tags: ['orm', 'sql'],             isPublic: true },
  { name: 'Vercel',        description: 'Deploy web projects instantly',   category: 'devops' as ToolCategory,   url: 'https://vercel.com',       icon: '▲', color: '#000000', tags: ['hosting', 'cdn'],         isPublic: true },
  { name: 'Clerk',         description: 'Authentication for the web',      category: 'auth' as ToolCategory,     url: 'https://clerk.com',        icon: '⚿', color: '#6C47FF', tags: ['auth', 'oauth'],          isPublic: true },
  { name: 'shadcn/ui',     description: 'Reusable component library',      category: 'ui' as ToolCategory,       url: 'https://ui.shadcn.com',    icon: '□', color: '#000000', tags: ['components', 'react'],    isPublic: true },
  { name: 'tRPC',          description: 'End-to-end typesafe APIs',        category: 'backend' as ToolCategory,  url: 'https://trpc.io',          icon: '⟳', color: '#2596BE', tags: ['api', 'typescript'],      isPublic: true },
  { name: 'PlanetScale',   description: 'Serverless MySQL platform',       category: 'database' as ToolCategory, url: 'https://planetscale.com',  icon: '◎', color: '#000000', tags: ['mysql', 'serverless'],    isPublic: true },
]
