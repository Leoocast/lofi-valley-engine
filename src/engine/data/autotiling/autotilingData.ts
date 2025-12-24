export interface AutotilingSpritesheet {
  id: string
  name: string
  layers: number[]
  bitmask: (number | null)[][]
  variations: Record<number, { cords: [number, number][]; percentage: number }>
}

export const defaultMeta = {
  width: 176,
  height: 112,
  tileWidth: 16,
  tileHeight: 16,
}

export const defaultBitmask: (number | null)[][] = [
  [28, 124, 112, 16, 20, 116, 92, 80, 84, 221, null],
  [31, 255, 241, 17, 23, 247, 223, 209, 215, 119],
  [7, 199, 193, 1, 29, 253, 127, 113, 125, 93, 117],
  [4, 68, 64, 0, 5, 197, 71, 65, 69, 87, 213],
  [null, null, null, null, 21, 245, 95, 81, 85, null, null],
]

export const defaultVariations: Record<
  number,
  { cords: [number, number][]; percentage: number }
> = {
  255: {
    cords: [
      [0, 5],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [0, 6],
      [1, 6],
      [2, 6],
      [3, 6],
      [4, 6],
    ],
    percentage: 0.2,
  },
}
