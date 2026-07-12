import { NextResponse } from 'next/server'
import { ToolController } from '@/server/controllers'
import { authMiddleware, rateLimitMiddleware, securityHeadersMiddleware } from '@/server/middleware'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'
import { errorResponse } from '@/server/http'

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    // Get security headers
    const securityHeaders = securityHeadersMiddleware(request)
    
    // Authenticate with Clerk
    const authResult = await authMiddleware(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { userId } = authResult
    
    // Get tools
    const tools = await ToolController.list(userId)
    
    return NextResponse.json({ success: true, data: tools }, {
      status: 200,
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', 'GET /api/tools failed', error)
    return errorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitError = rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError
    
    // Get security headers
    const securityHeaders = securityHeadersMiddleware(request)
    
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
      headers: securityHeaders
    })
  } catch (error: any) {
    logger.error('API', 'POST /api/tools failed', error)
    return errorResponse(error)
  }
}
