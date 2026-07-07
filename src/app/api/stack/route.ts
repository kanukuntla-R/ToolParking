import { NextResponse } from 'next/server'
import { StackController } from '@/server/controllers'
import { authMiddleware, rateLimitMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    const securityResponse = securityHeadersMiddleware(request)
    const user = authMiddleware(request)
    
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'projectId is required' },
        { status: 400, headers: securityResponse.headers }
      )
    }
    
    const stackItems = await StackController.list(projectId, user.userId)
    
    return NextResponse.json({ success: true, data: stackItems }, {
      status: 200,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', 'GET /api/stack failed', error)
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
    
    const securityResponse = securityHeadersMiddleware(request)
    const user = authMiddleware(request)
    
    const body = await request.json()
    const { projectId, toolId, lane, order } = body
    
    const stackItem = await StackController.add(user.userId, projectId, toolId, lane, order)
    
    return NextResponse.json({ success: true, data: stackItem }, {
      status: 201,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', 'POST /api/stack failed', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
