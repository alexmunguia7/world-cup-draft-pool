import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminRequest, logAuditEvent, successResponse, unauthorizedResponse, errorResponse } from '@/lib/admin-middleware'

/**
 * POST /api/admin/export
 * Export league data as JSON backup
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const isAdmin = await verifyAdminRequest(request)
    if (!isAdmin) {
      return unauthorizedResponse()
    }

    const leagueId = process.env.NEXT_PUBLIC_LEAGUE_ID || 'default'

    // Get all data
    const [
      { data: players },
      { data: teams },
      { data: picks },
      { data: scores },
      { data: standings },
      { data: settings },
      { data: auditLog },
    ] = await Promise.all([
      supabaseAdmin.from('players').select('*').eq('league_id', leagueId),
      supabaseAdmin.from('teams').select('*').eq('league_id', leagueId),
      supabaseAdmin.from('draft_picks').select('*').eq('league_id', leagueId),
      supabaseAdmin.from('scores').select('*').eq('league_id', leagueId),
      supabaseAdmin.from('standings').select('*').eq('league_id', leagueId),
      supabaseAdmin.from('settings').select('*').eq('league_id', leagueId),
      supabaseAdmin.from('audit_log').select('*').eq('league_id', leagueId),
    ])

    const backup = {
      league_id: leagueId,
      exported_at: new Date().toISOString(),
      version: '1.0',
      players: players || [],
      teams: teams || [],
      draft_picks: picks || [],
      scores: scores || [],
      standings: standings || [],
      settings: settings || [],
      audit_log: auditLog || [],
    }

    // Log audit
    await logAuditEvent(
      supabaseAdmin,
      'export_backup',
      'league',
      leagueId,
      null,
      null,
      'League data exported'
    )

    return successResponse(backup)
  } catch (error) {
    console.error('Export error:', error)
    return errorResponse('Failed to export league data')
  }
}
