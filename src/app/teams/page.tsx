'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Team {
  id: string
  country: string
  flag_emoji: string
  fifa_code: string
  status: 'available' | 'drafted'
  drafted_by?: string
}

interface Player {
  id: string
  name: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [playerMap, setPlayerMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'available' | 'drafted'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load teams
      const { data: teamsData } = await supabase.from('teams').select('*')
      setTeams(teamsData || [])

      // Load players for map
      const { data: playersData } = await supabase.from('players').select('*')
      const map = Object.fromEntries((playersData || []).map((p: Player) => [p.id, p.name]))
      setPlayerMap(map)
    } catch (err) {
      console.error('Failed to load:', err)
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

  const filtered = teams.filter((team) => {
    const matchesFilter =
      filter === 'all' || (filter === 'available' && team.status === 'available') || (filter === 'drafted' && team.status === 'drafted')
    const matchesSearch =
      team.country.toLowerCase().includes(search.toLowerCase()) ||
      (team.fifa_code || '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: teams.length,
    drafted: teams.filter((t) => t.status === 'drafted').length,
    available: teams.filter((t) => t.status === 'available').length,
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🌍 Teams</h1>
          <Link href="/" className="btn-secondary">
            Back Home
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-slate-400 text-sm">Total Teams</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm">Drafted</p>
            <p className="text-3xl font-bold text-blue-400">{stats.drafted}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm">Available</p>
            <p className="text-3xl font-bold text-green-400">{stats.available}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <section className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by country or FIFA code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-field-light"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'available', 'drafted'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? 'bg-field-light text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Teams Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((team) => (
            <div
              key={team.id}
              className={`card hover:shadow-lg transition-all ${
                team.status === 'drafted' ? 'opacity-75 bg-slate-800' : ''
              }`}
            >
              <p className="text-5xl text-center mb-2">{team.flag_emoji}</p>
              <p className="font-bold text-center text-sm truncate">{team.country}</p>
              {team.fifa_code && (
                <p className="text-slate-400 text-center text-xs">{team.fifa_code}</p>
              )}
              {team.status === 'drafted' && (
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <p className="text-xs text-center">
                    <span className="badge badge-drafted">Drafted</span>
                  </p>
                  {team.drafted_by && playerMap[team.drafted_by] && (
                    <p className="text-xs text-center text-slate-400 mt-1">
                      {playerMap[team.drafted_by]}
                    </p>
                  )}
                </div>
              )}
              {team.status === 'available' && (
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <p className="text-xs text-center">
                    <span className="badge badge-available">Available</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No teams found</p>
          </div>
        )}
      </div>
    </main>
  )
}
