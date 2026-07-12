import { NextResponse } from 'next/server'
import { ProjectController } from '@/server/controllers'
import { authMiddleware, rateLimitMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'
import { errorResponse } from '@/server/http'

export async function GET(request: NextRequest) {
  try {
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    const securityHeaders = securityHeadersMiddleware(request)
    const authResult = await authMiddleware(request)
    if (authResult instanceof NextResponse) return authResult
    
    const projects = await ProjectController.list(authResult.userId)
    
    return NextResponse.json({ success: true, data: projects }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', 'GET /api/projects failed', error)
    return errorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    const securityHeaders = securityHeadersMiddleware(request)
    const authResult = await authMiddleware(request)
    if (authResult instanceof NextResponse) return authResult
    
    const body = await request.json()
    const project = await ProjectController.create(authResult.userId, body)
    
    return NextResponse.json({ success: true, data: project }, {
      status: 201,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', 'POST /api/projects failed', error)
    return errorResponse(error)
  }
}
