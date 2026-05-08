export const formatDate = (isoDate) => {
  if (!isoDate) {
    return 'Not set'
  }

  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
