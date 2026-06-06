const statusStyles = {
  Completed: 'border-emerald-200 text-emerald-700',
  InProgress: 'border-blue-200 text-blue-700',
  Pending: 'border-amber-200 text-amber-700',
}

const statusLabels = {
  Completed: 'Completed',
  InProgress: 'In progress',
  Pending: 'Pending',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs ${
        statusStyles[status] || 'border-slate-200 text-slate-600'
      }`}
    >
      {statusLabels[status] || status}
    </span>
  )
}

export default StatusBadge
