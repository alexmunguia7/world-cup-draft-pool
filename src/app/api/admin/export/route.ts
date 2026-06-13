import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminRequest } from '@/lib/admin-middleware'

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const leagueId = process.env.NEXT_PUBLIC_LEAGUE_ID || 'default'

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

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export league data' },
      { status: 500 }
    )
  }
}
