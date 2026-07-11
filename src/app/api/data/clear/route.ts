import { NextResponse } from 'next/server'
import { DataController } from '@/server/controllers'
import { authMiddleware, rateLimitMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export async function DELETE(request: NextRequest) {
  try {
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError

    const securityHeaders = securityHeadersMiddleware(request)
    const authResult = await authMiddleware(request)
    if (authResult instanceof NextResponse) return authResult

    const { userId } = authResult
    await DataController.clearAll(userId)

    return NextResponse.json({ success: true, message: 'All data cleared' }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', 'DELETE /api/data/clear failed', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
