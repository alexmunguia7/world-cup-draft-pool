```tsx
export default function DraftBoardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">📋 Draft Board</h1>

        <p className="text-slate-400 mb-8">
          Live draft results will appear here once the draft begins.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-2">Draft Status</h2>
            <p className="text-slate-400">Not Started</p>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-2">Current Pick</h2>
            <p className="text-slate-400">Waiting for draft</p>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-2">Format</h2>
            <p className="text-slate-400">Snake Draft</p>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Draft Rules</h2>

          <ul className="space-y-2 text-slate-300">
            <li>• Snake draft format</li>
            <li>• Any number of players can participate</li>
            <li>• Each player drafts the same number of teams</li>
            <li>• Leftover teams remain undrafted</li>
            <li>• Teams cannot be drafted more than once</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Draft History</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-3">Pick</th>
                  <th className="text-left p-3">Player</th>
                  <th className="text-left p-3">Team</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={3} className="p-6 text-center text-slate-500">
                    No picks have been made yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
```
