/**
 * Reusable loading spinner component.
 */
function LoadingSpinner({ size = 'md', message = '' }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`animate-spin rounded-full border-slate-300 border-t-slate-900 ${sizeClasses[size]}`}
      />
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
