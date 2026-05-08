function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
      <p className="mt-2 text-xs text-slate-500">Updated today</p>
    </div>
  )
}

export default StatCard
