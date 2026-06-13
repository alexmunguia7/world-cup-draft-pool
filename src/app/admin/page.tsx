import Link from 'next/link'

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">🔐 Admin</h1>

        <div className="card">
          <p className="text-slate-300 mb-4">
            Admin controls are managed from the admin panel.
          </p>

          <Link href="/admin/panel" className="btn-primary">
            Go to Admin Panel
          </Link>
        </div>
      </div>
    </main>
  )
}
