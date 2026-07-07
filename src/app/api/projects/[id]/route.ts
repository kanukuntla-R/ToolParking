import { NextResponse } from 'next/server'
import { ProjectController } from '@/server/controllers'
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
    
    const project = await ProjectController.getById(params.id, user.userId)
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404, headers: securityResponse.headers }
      )
    }
    
    return NextResponse.json({ success: true, data: project }, {
      status: 200,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', `GET /api/projects failed`, error)
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
    const project = await ProjectController.update(params.id, user.userId, body)
    
    return NextResponse.json({ success: true, data: project }, {
      status: 200,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', `PUT /api/projects failed`, error)
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
    
    await ProjectController.delete(params.id, user.userId)
    
    return NextResponse.json({ success: true, message: 'Project deleted' }, {
      status: 200,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', `DELETE /api/projects failed`, error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
