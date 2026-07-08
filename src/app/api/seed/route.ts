import { NextResponse } from 'next/server'
import { DatabaseService } from '@/server/services/database'
import { authMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const securityHeaders = securityHeadersMiddleware(request)
    const authResult = await authMiddleware(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { userId } = authResult
    await DatabaseService.seedDefaults(userId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Default tools seeded successfully' 
    }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', 'POST /api/seed failed', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
