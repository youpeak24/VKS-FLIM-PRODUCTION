/** Privacy-enhanced YouTube embed URL (youtube-nocookie.com). */
export function youtubeEmbedUrl(id, { autoplay = false } = {}) {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`
}
