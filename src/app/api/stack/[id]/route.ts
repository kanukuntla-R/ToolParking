import { NextResponse } from 'next/server'
import { StackController } from '@/server/controllers'
import { authMiddleware, rateLimitMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'
import { errorResponse } from '@/server/http'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    const securityHeaders = securityHeadersMiddleware(request)
    const authResult = await authMiddleware(request)
    if (authResult instanceof NextResponse) return authResult
    
    const body = await request.json()
    const stackItem = await StackController.update(params.id, authResult.userId, body)
    
    return NextResponse.json({ success: true, data: stackItem }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', `PUT /api/stack failed`, error)
    return errorResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    const securityHeaders = securityHeadersMiddleware(request)
    const authResult = await authMiddleware(request)
    if (authResult instanceof NextResponse) return authResult
    
    await StackController.remove(params.id, authResult.userId)
    
    return NextResponse.json({ success: true, message: 'Stack item removed' }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', `DELETE /api/stack failed`, error)
    return errorResponse(error)
  }
}
