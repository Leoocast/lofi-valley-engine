# Blob Autotiling System

## Overview

8-direction bitmask autotiling for ground tiles. Uses 49-tile blob spritesheet.

## Bitmask Layout

```
Bit 0: N  (1)      Bit 4: S  (16)
Bit 1: NE (2)      Bit 5: SW (32)
Bit 2: E  (4)      Bit 6: W  (64)
Bit 3: SE (8)      Bit 7: NW (128)
```

## Files

- `src/engine/autotiling/blobAutotiling.ts` - Core system
- `src/engine/interfaces/spritesheets.ts` - GRASS_BLOB_SPRITESHEET config

## Key Functions

| Function                 | Purpose                                |
| ------------------------ | -------------------------------------- |
| `calculateBlobBitmask()` | Calculates 8-bit mask from 8 neighbors |
| `refineBitmask()`        | Removes invalid diagonal bits          |
| `getBlobTileIndex()`     | Maps bitmask → sprite index            |
| `paintBlobArea()`        | Paints tiles with autotiling           |

## Bitmask Refinement

Diagonal bits are ignored when adjacent cardinals aren't present:

```typescript
// NE only valid if both N AND E exist
if (!(mask & N && mask & E)) {
  mask &= ~NE // Remove NE bit
}
```

This normalizes bitmasks to match the 49 patterns in the lookup table.

## Spritesheet

- **File:** `public/spritesheets/autotiling/grass/terrain/blob.png`
- **Size:** 112×112px (7×7 grid of 16×16 tiles)
- **Tiles:** 49 unique blob patterns

## Usage

Grass 2 (type=2) uses blob autotiling in paint mode:

```typescript
if (selectedGroundTile === 2) {
  return paintBlobArea(x, y, radius, tileType, layer, tiles, w, h)
}
```
