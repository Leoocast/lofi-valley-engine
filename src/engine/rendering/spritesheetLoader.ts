/**
 * Spritesheet Loader
 * Preloads spritesheets as Image objects for canvas rendering
 */

const imageCache = new Map<string, HTMLImageElement>()
const loadingPromises = new Map<string, Promise<HTMLImageElement>>()

/**
 * Load an image and cache it
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  // Return cached image immediately
  const cached = imageCache.get(src)
  if (cached) {
    return Promise.resolve(cached)
  }

  // Return existing loading promise if already loading
  const loading = loadingPromises.get(src)
  if (loading) {
    return loading
  }

  // Start new load
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      imageCache.set(src, img)
      loadingPromises.delete(src)
      resolve(img)
    }
    img.onerror = () => {
      loadingPromises.delete(src)
      reject(new Error(`Failed to load image: ${src}`))
    }
    img.src = src
  })

  loadingPromises.set(src, promise)
  return promise
}

/**
 * Get cached image (returns undefined if not loaded)
 */
export function getCachedImage(src: string): HTMLImageElement | undefined {
  return imageCache.get(src)
}

/**
 * Preload multiple spritesheets
 */
export async function preloadSpritesheets(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(loadImage))
}
