/**
 * Responsive artwork / image. Decorative by default (empty alt, hidden from assistive tech).
 * `image` is a descriptor from data/artwork.js: { src, srcSet, width, height }.
 */
export default function PaintArtwork({ image, alt = '', sizes = '100vw', priority = false, className = '', ...rest }) {
  if (!image?.src) return null
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      draggable="false"
      className={className}
      {...rest}
    />
  )
}
