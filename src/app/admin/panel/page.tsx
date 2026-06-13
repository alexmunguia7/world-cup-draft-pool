'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Player {
  id: string
  name: string
  order: number
  buy_in: number
}

interface Team {
  id: string
  country: string
  flag_emoji: string
  status: 'available' | 'drafted'
  drafted_by?: string
}

export default function AdminPanel() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .order('order', { ascending: true })

      if (playersError) throw playersError

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')

      if (teamsError) throw teamsError

      setPlayers(playersData || [])
      setTeams(teamsData || [])
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-4 text-white">
        <div className="text-center py-12">
          <p className="text-slate-400">Loading...</p>
        </div>
      </main>
    )
  }

  const draftedCount = teams.filter((t) => t.status === 'drafted').length
  const availableCount = teams.filter((t) => t.status === 'available').length
  const teamsPerPlayer =
    players.length > 0 ? Math.floor(teams.length / players.length) : 0
  const maxDraftPicks = teamsPerPlayer * players.length
  const leftoverTeams = teams.length - maxDraftPicks

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">⚙️ Admin Panel</h1>
          <div className="space-x-2">
            <Link href="/" className="btn-secondary inline-block">
              Back Home
            </Link>
            <Link href="/admin" className="btn-danger inline-block">
              Logout
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-slate-400 text-sm">Draft Status</p>
            <p className="text-2xl font-bold text-field-light">Not Started</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm">Teams Drafted</p>
            <p className="text-2xl font-bold">{draftedCount}/{maxDraftPicks}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm">Teams Available</p>
            <p className="text-2xl font-bold text-green-400">{availableCount}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm">Teams Per Player</p>
            <p className="text-2xl font-bold">{teamsPerPlayer}</p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Draft Format</h2>
          <div className="card">
            <p className="text-slate-300">
              {players.length} players × {teamsPerPlayer} teams each = {maxDraftPicks} drafted teams.
            </p>
            <p className="text-slate-400 mt-2">
              {leftoverTeams} teams will remain undrafted.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <div key={player.id} className="card">
                <p className="text-field-light font-semibold">#{player.order}</p>
                <p className="text-xl font-bold">{player.name}</p>
                <p className="text-slate-400 text-sm">Buy-in: ${player.buy_in}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Draft Board</h2>
          <div className="card text-center py-12">
            <p className="text-slate-400 mb-4">Go to Draft Board page to manage draft</p>
            <Link href="/draft-board" className="btn-primary">
              Open Draft Board
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
