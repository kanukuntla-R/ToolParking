import { NextResponse } from 'next/server'

function getClientError(error: unknown): { message: string; status: number } {
  const message = error instanceof Error ? error.message : ''

  if (message.startsWith('Validation failed:')) {
    return { message, status: 400 }
  }

  if (message.toLowerCase().includes('unauthorized')) {
    return { message: 'Not found or unauthorized', status: 404 }
  }

  if (message.toLowerCase().includes('not found')) {
    return { message: 'Not found', status: 404 }
  }

  return { message: 'Internal server error', status: 500 }
}

export function errorResponse(error: unknown, headers?: HeadersInit) {
  const clientError = getClientError(error)

  return NextResponse.json(
    { success: false, error: clientError.message },
    { status: clientError.status, headers }
  )
}
