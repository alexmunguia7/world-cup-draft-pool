export default function DraftBoardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">📋 Draft Board</h1>
        <p className="text-slate-400 mb-8">
          Live draft results will appear here once the draft begins.
        </p>
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Draft Rules</h2>
          <ul className="space-y-2 text-slate-300">
            <li>Snake draft format</li>
            <li>Any number of players can participate</li>
            <li>Each player drafts the same number of teams</li>
            <li>Leftover teams remain undrafted</li>
            <li>Teams cannot be drafted more than once</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
