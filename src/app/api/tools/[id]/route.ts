import { NextResponse } from 'next/server'
import { ToolController } from '@/server/controllers'
import { authMiddleware, rateLimitMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'
import { errorResponse } from '@/server/http'

export async function GET(
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
    
    const tools = await ToolController.list(authResult.userId)
    const tool = tools.find((t) => t.$id === params.id)
    
    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404, headers: securityHeaders }
      )
    }
    
    return NextResponse.json({ success: true, data: tool }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', `GET /api/tools failed`, error)
    return errorResponse(error)
  }
}

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
    const tool = await ToolController.update(params.id, authResult.userId, body)
    
    return NextResponse.json({ success: true, data: tool }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', `PUT /api/tools failed`, error)
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
    
    await ToolController.delete(params.id, authResult.userId)
    
    return NextResponse.json({ success: true, message: 'Tool deleted' }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', `DELETE /api/tools failed`, error)
    return errorResponse(error)
  }
}
