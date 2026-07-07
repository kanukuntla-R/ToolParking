import { NextResponse } from 'next/server'
import { ToolController } from '@/server/controllers'
import { authMiddleware, rateLimitMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    // Apply security headers
    const securityResponse = securityHeadersMiddleware(request)
    
    // Authenticate with Clerk
    const authResult = await authMiddleware(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { userId } = authResult
    
    // Get tools
    const tools = await ToolController.list(userId)
    
    return NextResponse.json({ success: true, data: tools }, {
      status: 200,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', 'GET /api/tools failed', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    // Apply security headers
    const securityResponse = securityHeadersMiddleware(request)
    
    // Authenticate with Clerk
    const authResult = await authMiddleware(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { userId } = authResult
    
    // Parse request body
    const body = await request.json()
    
    // Create tool
    const tool = await ToolController.create(userId, body)
    
    return NextResponse.json({ success: true, data: tool }, {
      status: 201,
      headers: securityResponse.headers
    })
  } catch (error: any) {
    logger.error('API', 'POST /api/tools failed', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
