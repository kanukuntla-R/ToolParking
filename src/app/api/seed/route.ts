import { NextResponse } from 'next/server'
import { DatabaseService } from '@/server/services/database'
import { authMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const securityResponse = securityHeadersMiddleware(request)
    const user = authMiddleware(request)
    
    await DatabaseService.seedDefaults(user.userId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Default tools seeded successfully' 
    }, {
      status: 200,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', 'POST /api/seed failed', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
