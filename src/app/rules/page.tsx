export default function RulesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Rules</h1>

      <h2 className="text-2xl font-bold mt-6 mb-2">Group Stage</h2>
      <p>Win: 3 points</p>
      <p>Draw/Tie: 1 point</p>
      <p>Loss: 0 points</p>

      <h2 className="text-2xl font-bold mt-6 mb-2">Knockout Advancement</h2>
      <p>Round of 32: 5 points</p>
      <p>Round of 16: 10 points</p>
      <p>Quarterfinals: 15 points</p>
      <p>Semifinals: 20 points</p>
      <p>Runner-Up: 25 points</p>
      <p>World Cup Winner: 35 points</p>
    </main>
  )
}
