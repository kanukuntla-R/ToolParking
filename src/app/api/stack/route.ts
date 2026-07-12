import { NextResponse } from 'next/server'
import { StackController } from '@/server/controllers'
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
    
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'projectId is required' },
        { status: 400, headers: securityHeaders }
      )
    }
    
    const stackItems = await StackController.list(projectId, authResult.userId)
    
    return NextResponse.json({ success: true, data: stackItems }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', 'GET /api/stack failed', error)
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
    const { projectId, toolId, lane, order } = body
    
    const stackItem = await StackController.add(authResult.userId, projectId, toolId, lane, order)
    
    return NextResponse.json({ success: true, data: stackItem }, {
      status: 201,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', 'POST /api/stack failed', error)
    return errorResponse(error)
  }
}
