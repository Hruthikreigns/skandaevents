/**
 * Responsive <picture> for images produced by scripts/build-media.mjs.
 * Always passes intrinsic width/height so the browser reserves the right aspect ratio.
 */
export default function Picture({
  image,
  sizes = '100vw',
  alt,
  className,
  imgClassName,
  priority = false,
  style,
}) {
  if (!image) return null
  const altText = alt ?? image.alt
  return (
    <picture className={className}>
      {image.webpSrcSet && <source type="image/webp" srcSet={image.webpSrcSet} sizes={sizes} />}
      {image.srcSet && <source type={image.fallbackType} srcSet={image.srcSet} sizes={sizes} />}
      <img
        className={imgClassName}
        src={image.src}
        alt={altText}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        style={{ backgroundColor: image.color ?? undefined, ...style }}
      />
    </picture>
  )
}
