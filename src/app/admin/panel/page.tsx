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

interface DraftStatus {
  current_pick: number
  current_round: number
  current_player_order: number
  draft_started: boolean
  draft_completed: boolean
  picks: any[]
}

export default function AdminPanel() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [draftStatus, setDraftStatus] = useState<DraftStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load players
      const { data: playersData } = await supabase.from('players').select('*').order('order')
      setPlayers(playersData || [])

      // Load teams
      const { data: teamsData } = await supabase.from('teams').select('*')
      setTeams(teamsData || [])

      // Load draft status
      const response = await fetch('/api/draft/pick')
      const status = await response.json()
      setDraftStatus(status)
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-4">
        <div className="text-center py-12">
          <p className="text-slate-400">Loading...</p>
        </div>
      </main>
    )
  }

  const draftedCount = teams.filter((t) => t.status === 'drafted').length
  const availableCount = teams.filter((t) => t.status === 'available').length

  return (
    <main className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-slate-400 text-sm">Draft Status</p>
            <p className="text-2xl font-bold text-field-light">
              {draftStatus?.draft_started ? 'In Progress' : 'Not Started'}
            </p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm">Teams Drafted</p>
            <p className="text-2xl font-bold">{draftedCount}/48</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm">Teams Available</p>
            <p className="text-2xl font-bold text-green-400">{availableCount}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm">Current Round</p>
            <p className="text-2xl font-bold">{draftStatus?.current_round || 'N/A'}</p>
          </div>
        </div>

        {/* Players Section */}
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

        {/* Draft Board Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Draft Board</h2>
          <div className="card text-center py-12">
            <p className="text-slate-400 mb-4">Go to Draft Board page to manage draft</p>
            <Link href="/draft-board" className="btn-primary">
              Open Draft Board
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/players"
              className="card hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <p className="font-bold">Edit Players</p>
              <p className="text-slate-400 text-sm">Update player names and buy-ins</p>
            </Link>
            <Link
              href="/admin/teams"
              className="card hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <p className="font-bold">Edit Teams</p>
              <p className="text-slate-400 text-sm">Update team names and flags</p>
            </Link>
            <Link
              href="/admin/scoring"
              className="card hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <p className="font-bold">Manual Scoring</p>
              <p className="text-slate-400 text-sm">Record match results manually</p>
            </Link>
            <Link
              href="/admin/audit"
              className="card hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <p className="font-bold">Audit Log</p>
              <p className="text-slate-400 text-sm">View all administrative changes</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
