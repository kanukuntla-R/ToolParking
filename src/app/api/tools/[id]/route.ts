import { NextResponse } from 'next/server'
import { ToolController } from '@/server/controllers'
import { authMiddleware, rateLimitMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    const securityResponse = securityHeadersMiddleware(request)
    const user = authMiddleware(request)
    
    const tools = await ToolController.list(user.userId)
    const tool = tools.find((t) => t.$id === params.id)
    
    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404, headers: securityResponse.headers }
      )
    }
    
    return NextResponse.json({ success: true, data: tool }, {
      status: 200,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', `GET /api/tools failed`, error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
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
    
    const securityResponse = securityHeadersMiddleware(request)
    const user = authMiddleware(request)
    
    const body = await request.json()
    const tool = await ToolController.update(params.id, user.userId, body)
    
    return NextResponse.json({ success: true, data: tool }, {
      status: 200,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', `PUT /api/tools failed`, error)
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
    
    const securityResponse = securityHeadersMiddleware(request)
    const user = authMiddleware(request)
    
    await ToolController.delete(params.id, user.userId)
    
    return NextResponse.json({ success: true, message: 'Tool deleted' }, {
      status: 200,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', `DELETE /api/tools failed`, error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
