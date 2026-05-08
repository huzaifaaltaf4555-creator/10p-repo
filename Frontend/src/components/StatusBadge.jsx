const statusStyles = {
  Completed: 'border-emerald-200 text-emerald-700',
  'In progress': 'border-blue-200 text-blue-700',
  Pending: 'border-amber-200 text-amber-700',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs ${
        statusStyles[status] || 'border-slate-200 text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
