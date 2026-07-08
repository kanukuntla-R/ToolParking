import { NextResponse } from 'next/server'
import { StackController } from '@/server/controllers'
import { authMiddleware, rateLimitMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    const securityHeaders = securityHeadersMiddleware(request)
    const user = await authMiddleware(request)
    
    const body = await request.json()
    const stackItem = await StackController.update(params.id, user.userId, body)
    
    return NextResponse.json({ success: true, data: stackItem }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', `PUT /api/stack failed`, error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
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
    const user = await authMiddleware(request)
    
    await StackController.remove(params.id, user.userId)
    
    return NextResponse.json({ success: true, message: 'Stack item removed' }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', `DELETE /api/stack failed`, error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
