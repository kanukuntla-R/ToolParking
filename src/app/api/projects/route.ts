import { NextResponse } from 'next/server'
import { ProjectController } from '@/server/controllers'
import { authMiddleware, rateLimitMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    const securityHeaders = securityHeadersMiddleware(request)
    const user = await authMiddleware(request)
    
    const projects = await ProjectController.list(user.userId)
    
    return NextResponse.json({ success: true, data: projects }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', 'GET /api/projects failed', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    const securityHeaders = securityHeadersMiddleware(request)
    const user = await authMiddleware(request)
    
    const body = await request.json()
    const project = await ProjectController.create(user.userId, body)
    
    return NextResponse.json({ success: true, data: project }, {
      status: 201,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', 'POST /api/projects failed', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
