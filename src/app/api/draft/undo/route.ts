import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminRequest, logAuditEvent, successResponse, unauthorizedResponse, errorResponse } from '@/lib/admin-middleware'

/**
 * POST /api/draft/undo
 * Undo the last draft pick
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const isAdmin = await verifyAdminRequest(request)
    if (!isAdmin) {
      return unauthorizedResponse()
    }

    const leagueId = process.env.NEXT_PUBLIC_LEAGUE_ID || 'default'

    // Get last pick
    const { data: lastPick, error: pickError } = await supabaseAdmin
      .from('draft_picks')
      .select('*')
      .eq('league_id', leagueId)
      .order('pick_number', { ascending: false })
      .limit(1)
      .single()

    if (pickError || !lastPick) {
      return errorResponse('No picks to undo')
    }

    // Update team back to available
    const { error: teamUpdateError } = await supabaseAdmin
      .from('teams')
      .update({
        status: 'available',
        drafted_by: null,
        draft_pick_number: null,
        draft_round: null,
        draft_position: null,
      })
      .eq('id', lastPick.team_id)

    if (teamUpdateError) throw teamUpdateError

    // Delete draft pick
    const { error: deleteError } = await supabaseAdmin
      .from('draft_picks')
      .delete()
      .eq('id', lastPick.id)

    if (deleteError) throw deleteError

    // Update settings
    const prevPick = lastPick.pick_number - 1

    const { error: settingsError } = await supabaseAdmin
      .from('settings')
      .upsert([
        {
          league_id: leagueId,
          key: 'current_pick',
          value: prevPick.toString(),
        },
        {
          league_id: leagueId,
          key: 'current_round',
          value: Math.ceil(prevPick / 6).toString(),
        },
      ])

    if (settingsError) throw settingsError

    // Log audit
    await logAuditEvent(
      supabaseAdmin,
      'undo_pick',
      'team',
      lastPick.team_id,
      { pick_number: lastPick.pick_number, player_id: lastPick.player_id },
      null,
      `Pick #${lastPick.pick_number} undone`
    )

    return successResponse({
      message: 'Last pick undone',
      undone_pick: lastPick,
      current_pick: prevPick,
    })
  } catch (error) {
    console.error('Undo error:', error)
    return errorResponse('Failed to undo pick')
  }
}
