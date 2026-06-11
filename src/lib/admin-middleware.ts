import { NextRequest, NextResponse } from 'next/server'

export async function verifyAdminRequest(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const providedPassword =
    request.headers.get('x-admin-password') ||
    request.nextUrl.searchParams.get('password')

  return !!adminPassword && providedPassword === adminPassword
}

export async function logAuditEvent(...args: any[]) {
  return null
}

export function successResponse(data: any) {
  return NextResponse.json(data)
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function errorResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 500 })
}
