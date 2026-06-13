'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Player = {
  id: string
  name: string
  order: number
}

type Team = {
  id: string
  country: string
  flag_emoji: string
  status: string
  drafted_by?: string | null
}

type DraftPick = {
  id: string
  pick_number: number
  round_number: number
  player_id: string
  team_id: string
  players?: Player
  teams?: Team
}

export default function DraftBoardPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [picks, setPicks] = useState<DraftPick[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)

    const { data: playersData } = await supabase
      .from('players')
      .select('*')
      .order('order', { ascending: true })

    const { data: teamsData } = await supabase
      .from('teams')
      .select('*')
      .order('country', { ascending: true })

    const { data: picksData } = await supabase
      .from('draft_picks')
      .select('*, players(*), teams(*)')
      .order('pick_number', { ascending: true })

    setPlayers(playersData || [])
    setTeams(teamsData || [])
    setPicks(picksData || [])
    setLoading(false)
  }

  const teamsPerPlayer =
    players.length > 0 ? Math.floor(teams.length / players.length) : 0

  const maxPicks = teamsPerPlayer * players.length
  const currentPickNumber = picks.length + 1
  const draftComplete = picks.length >= maxPicks && maxPicks > 0

  const getCurrentPlayer = () => {
    if (players.length === 0 || draftComplete) return null

    const pickIndex = picks.length
    const roundIndex = Math.floor(pickIndex / players.length)
    const positionInRound = pickIndex % players.length

    const playerIndex =
      roundIndex % 2 === 0
        ? positionInRound
        : players.length - 1 - positionInRound

    return players[playerIndex]
  }

  const currentPlayer = getCurrentPlayer()
  const availableTeams = teams.filter((team) => team.status !== 'drafted')

  const makePick = async () => {
    if (!currentPlayer || !selectedTeamId) {
      setMessage('Select a team first.')
      return
    }

    setSaving(true)
    setMessage('')

    const selectedTeam = teams.find((team) => team.id === selectedTeamId)
    if (!selectedTeam || selectedTeam.status === 'drafted') {
      setMessage('That team is no longer available.')
      setSaving(false)
      return
    }

    const roundNumber = Math.floor(picks.length / players.length) + 1

    const { error: pickError } = await supabase.from('draft_picks').insert({
  league_id: 'default',
  player_id: currentPlayer.id,
  team_id: selectedTeam.id,
  pick_number: currentPickNumber,
  position: currentPickNumber,
  round: roundNumber,
  round_number: roundNumber,
})

    if (pickError) {
      setMessage(`Pick failed: ${pickError.message}`)
      setSaving(false)
      return
    }

    const { error: teamError } = await supabase
      .from('teams')
      .update({
        status: 'drafted',
        drafted_by: currentPlayer.id,
        draft_pick_number: currentPickNumber,
      })
      .eq('id', selectedTeam.id)

    if (teamError) {
      setMessage(`Team update failed: ${teamError.message}`)
      setSaving(false)
      return
    }

    setSelectedTeamId('')
    setMessage(`${currentPlayer.name} drafted ${selectedTeam.flag_emoji} ${selectedTeam.country}`)
    await loadData()
    setSaving(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        Loading draft board...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">📋 Draft Board</h1>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Make Pick</h2>

          <p className="text-slate-300 mb-2">
            Players: {players.length}
          </p>
          <p className="text-slate-300 mb-2">
            Teams per player: {teamsPerPlayer}
          </p>
          <p className="text-slate-300 mb-4">
            Drafted: {picks.length}/{maxPicks}
          </p>

          {draftComplete ? (
            <p className="text-green-400 font-bold">Draft complete.</p>
          ) : (
            <>
              <p className="text-xl font-bold mb-4">
                Current Pick #{currentPickNumber}: {currentPlayer?.name}
              </p>

              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full p-3 rounded bg-slate-900 border border-slate-700 mb-4"
              >
                <option value="">Select available team...</option>
                {availableTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.flag_emoji} {team.country}
                  </option>
                ))}
              </select>

              <button
                onClick={makePick}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? 'Saving...' : 'Make Pick'}
              </button>
            </>
          )}

          {message && <p className="mt-4 text-slate-300">{message}</p>}
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Draft History</h2>

          {picks.length === 0 ? (
            <p className="text-slate-400">No picks yet.</p>
          ) : (
            <div className="space-y-3">
              {picks.map((pick) => (
                <div
                  key={pick.id}
                  className="flex justify-between border-b border-slate-800 pb-2"
                >
                  <span>Pick #{pick.pick_number}</span>
                  <span>{pick.players?.name}</span>
                  <span>
                    {pick.teams?.flag_emoji} {pick.teams?.country}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
