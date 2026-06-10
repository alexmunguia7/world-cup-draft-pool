'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [leagueStatus, setLeagueStatus] = useState<any>(null)
  const [totalPot, setTotalPot] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      // Get draft status
      const response = await fetch('/api/admin')
      const status = await response.json()
      setLeagueStatus(status)

      // Get total pot
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'total_pot')
        .single()

      if (settings?.value) {
        setTotalPot(parseFloat(settings.value))
      }
    } catch (err) {
      console.error('Failed to load status:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <p className="text-slate-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-2">⚽ World Cup Draft Pool</h1>
            <p className="text-slate-400">Fantasy sports league for the FIFA World Cup</p>
          </div>
          <Link href="/admin" className="btn-primary">
            Admin Login
          </Link>
        </div>

        {/* Status Cards */}
        {leagueStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="card">
              <p className="text-slate-400 text-sm">Draft Status</p>
              <p className="text-2xl font-bold text-field-light">
                {leagueStatus.draft_completed
                  ? '✅ Complete'
                  : leagueStatus.draft_started
                    ? '🔄 In Progress'
                    : '⏳ Not Started'}
              </p>
            </div>
            <div className="card">
              <p className="text-slate-400 text-sm">Teams Drafted</p>
              <p className="text-2xl font-bold">{leagueStatus.drafted_count}/48</p>
            </div>
            <div className="card">
              <p className="text-slate-400 text-sm">Players</p>
              <p className="text-2xl font-bold">{leagueStatus.players_count}</p>
            </div>
            <div className="card">
              <p className="text-slate-400 text-sm">Total Pot</p>
              <p className="text-2xl font-bold text-trophy">${totalPot.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Draft Board */}
          <Link
            href="/draft-board"
            className="card hover:bg-slate-800 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">📋 Draft Board</h2>
              <span className="text-3xl group-hover:scale-110 transition-transform">→</span>
            </div>
            <p className="text-slate-400">
              View the draft history and current draft progress
            </p>
          </Link>

          {/* Teams */}
          <Link
            href="/teams"
            className="card hover:bg-slate-800 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">🌍 Teams</h2>
              <span className="text-3xl group-hover:scale-110 transition-transform">→</span>
            </div>
            <p className="text-slate-400">View all 48 World Cup teams and their status</p>
          </Link>

          {/* Players */}
          <Link
            href="/players"
            className="card hover:bg-slate-800 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">👥 Players</h2>
              <span className="text-3xl group-hover:scale-110 transition-transform">→</span>
            </div>
            <p className="text-slate-400">View player rosters and standings</p>
          </Link>

          {/* Leaderboard */}
          <Link
            href="/leaderboard"
            className="card hover:bg-slate-800 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
              <span className="text-3xl group-hover:scale-110 transition-transform">→</span>
            </div>
            <p className="text-slate-400">Live standings and final rankings</p>
          </Link>

          {/* Rules */}
          <Link
            href="/rules"
            className="card hover:bg-slate-800 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">📖 Rules</h2>
              <span className="text-3xl group-hover:scale-110 transition-transform">→</span>
            </div>
            <p className="text-slate-400">Learn the scoring system and format</p>
          </Link>

          {/* Payouts */}
          <Link
            href="/payouts"
            className="card hover:bg-slate-800 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">💰 Payouts</h2>
              <span className="text-3xl group-hover:scale-110 transition-transform">→</span>
            </div>
            <p className="text-slate-400">Winner-take-all payout structure</p>
          </Link>
        </div>

        {/* Info Section */}
        <section className="card border-2 border-field-light">
          <h2 className="text-2xl font-bold mb-4">ℹ️ About This League</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-200">
            <div>
              <p className="font-bold mb-2">Snake Draft Format</p>
              <p className="text-sm">6 players draft 8 teams each in a snake draft pattern for fairness</p>
            </div>
            <div>
              <p className="font-bold mb-2">Score on Performance</p>
              <p className="text-sm">Teams earn points for group stage wins/draws and tournament advancement</p>
            </div>
            <div>
              <p className="font-bold mb-2">Winner Takes All</p>
              <p className="text-sm">The player with the most points wins 100% of the total pot</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
