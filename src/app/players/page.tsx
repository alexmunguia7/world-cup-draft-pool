import { supabase } from '@/lib/supabase'

export default async function PlayersPage() {
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .order('order', { ascending: true })

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">👥 Players</h1>

        <p className="text-slate-400 mb-8">
          View all players in the draft pool.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players && players.length > 0 ? (
            players.map((player) => (
              <div key={player.id} className="card">
                <h2 className="text-2xl font-bold">{player.name}</h2>
                <p className="text-slate-400">Draft Order: {player.order}</p>
                <p className="text-slate-400">Buy-In: ${player.buy_in}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-400">No players found.</p>
          )}
        </div>
      </div>
    </main>
  )
}
