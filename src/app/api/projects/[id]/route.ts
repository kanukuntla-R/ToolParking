import { NextResponse } from 'next/server'
import { ProjectController } from '@/server/controllers'
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
    
    const project = await ProjectController.getById(params.id, authResult.userId)
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404, headers: securityHeaders }
      )
    }
    
    return NextResponse.json({ success: true, data: project }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', `GET /api/projects failed`, error)
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
    const project = await ProjectController.update(params.id, authResult.userId, body)
    
    return NextResponse.json({ success: true, data: project }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', `PUT /api/projects failed`, error)
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
    
    await ProjectController.delete(params.id, authResult.userId)
    
    return NextResponse.json({ success: true, message: 'Project deleted' }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', `DELETE /api/projects failed`, error)
    return errorResponse(error)
  }
}
