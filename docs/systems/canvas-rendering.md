# Canvas Ground Rendering

## Overview

HTML5 Canvas-based rendering for ground tiles. Replaces DOM divs with 3 canvas elements (one per layer).

## Files

- `src/engine/rendering/canvasGroundRenderer.ts` - Canvas drawing functions
- `src/engine/rendering/spritesheetLoader.ts` - Image loading/caching
- `src/components/Grid/Grid.tsx` - Canvas-based Grid component

## Architecture

```
Before: 3,000+ <div> elements (one per tile per layer)
After:  3 <canvas> elements (one per layer)
```

```tsx
<CanvasLayers>
  {" "}
  // Memoized component
  <canvas layer0 /> // Ground base
  <canvas layer1 /> // Ground mid
  <canvas layer2 /> // Ground top
</CanvasLayers>
```

## Key Functions

### canvasGroundRenderer.ts

| Function            | Purpose                                 |
| ------------------- | --------------------------------------- |
| `drawTile()`        | Draws single tile from spritesheet      |
| `drawLayer()`       | Draws entire layer (full redraw)        |
| `updateTiles()`     | Draws only changed tiles (incremental)  |
| `clearTile()`       | Clears single tile position             |
| `findChangedKeys()` | Compares two Maps, returns changed keys |

### spritesheetLoader.ts

| Function                | Purpose                            |
| ----------------------- | ---------------------------------- |
| `loadImage()`           | Loads and caches spritesheet Image |
| `getCachedImage()`      | Returns cached Image object        |
| `preloadSpritesheets()` | Preloads multiple spritesheets     |

## Incremental Updates

Only tiles that changed are redrawn:

```typescript
const changedKeys = findChangedKeys(prev, groundTiles)
if (changedKeys.size > 0 && changedKeys.size < 100) {
  renderIncrementally(changedKeys) // Fast path: ~25 tiles
} else if (changedKeys.size >= 100) {
  renderAllLayers() // Full redraw for bulk changes
}
// 0 changes = no render at all
```

## Performance Results

| Grid Size        | Tiles  | Status        |
| ---------------- | ------ | ------------- |
| 32×32 × 3 layers | ~3,000 | ✅ Smooth     |
| 60×60            | ~3,600 | ✅ Smooth     |
| 70×70 full       | ~4,900 | ⚠️ Slight lag |

## CSS Requirements

Canvas elements need `imageRendering: "pixelated"` for crisp pixels:

```tsx
<canvas style={{ imageRendering: "pixelated" }} />
```
