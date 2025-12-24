import { SpriteSheetData } from "../spritesheetData"

// ============================================================
// SHEET SPRITE TYPE - Unified sprite + item definition
// ============================================================

export interface SheetSprite {
  id: string
  name: string

  // === Location in spritesheet (in tiles) ===
  region: {
    x: number // Starting column
    y: number // Starting row
    width: number // Width in tiles
    height: number // Height in tiles
  }

  // === Collision / footprint ===
  collision?: {
    width: number // Footprint width in tiles
    height: number // Footprint height in tiles
    offsetX?: number // Offset from left edge (default 0)
    offsetY?: number // Offset from top (default = height - collision.height)
  }

  // === Hitboxes for mouse detection (optional, relative to region) ===
  hitboxes?: Array<{ x: number; y: number; w: number; h: number }>

  // === Minimap color ===
  minimapColor?: string

  // === Category ===
  category?:
    | "tree"
    | "resource"
    | "decoration"
    | "building"
    | "foliage"
    | "crop"

  // === If it's a storable item ===
  item?: {
    type: "seed" | "harvest" | "resource" | "tool" | "placeable"
    stackable: boolean
    maxStack?: number
    emoji: string // Fallback icon
  }

  // === If it's a breakable resource ===
  breakable?: {
    tool: "axe" | "pickaxe" | "hands"
    hp: number
    drops: Array<{ itemId: string; min: number; max: number }>
  }

  // === Animation (for animated sprites) ===
  animation?: {
    frames: Array<{ x: number; y: number; width: number; height: number }> // Each frame's region
    frameDuration: number // ms per frame
  }
}

export const WINTER_SPRITES_DATA: SpriteSheetData<{
  sprites: SheetSprite[]
}> = {
  meta: {
    src: "decorations/winter/tree_and_decos.png",
    width: 240,
    height: 144,
    category: "Custom",
    tileWidth: 16,
    tileHeight: 16,
  },
  sprites: [
    {
      id: "winter-tree",
      name: "Winter Tree",
      region: { x: 0, y: 0, width: 3, height: 3 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "winter-tree-2",
      name: "Winter Tree 2",
      region: { x: 3, y: 0, width: 3, height: 3 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "winter-tree-3",
      name: "Winter Tree 3",
      region: { x: 6, y: 0, width: 3, height: 3 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "winter-tree-4",
      name: "Winter Tree 4",
      region: { x: 9, y: 0, width: 3, height: 3 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "christmas-tree",
      name: "Christmas Tree",
      region: { x: 12, y: 0, width: 3, height: 4 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "winter-tree-slim",
      name: "Winter Tree Slim",
      region: { x: 0, y: 3, width: 1, height: 2 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "winter-tree-short",
      name: "Winter Tree Short",
      region: { x: 1, y: 3, width: 2, height: 2 },
      collision: { width: 2, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "winter-bush-1",
      name: "Winter Bush 1",
      region: { x: 3, y: 3, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "winter-bush-2",
      name: "Winter Bush 2",
      region: { x: 4, y: 3, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "winter-teemo-2",
      name: "Winter Teemo 2",
      region: { x: 7, y: 3, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "winter-teemo-3",
      name: "Winter Teemo 3",
      region: { x: 8, y: 3, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "winter-teemo-4",
      name: "Winter teemo 4",
      region: { x: 6, y: 4, width: 1, height: 2 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "snow-man-short-1",
      name: "Snow man short 1",
      region: { x: 9, y: 3, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "snowman-short-2",
      name: "Snowman Short 2",
      region: { x: 10, y: 3, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "snowman-short-3",
      name: "Snowman Short 3",
      region: { x: 11, y: 3, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "snow-man",
      name: "Snow Man",
      region: { x: 7, y: 4, width: 1, height: 2 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "snow-man-hat",
      name: "Snow Man Hat",
      region: { x: 8, y: 4, width: 1, height: 2 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "short-candy",
      name: "Short Candy",
      region: { x: 9, y: 4, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "poinsettia-little",
      name: "Poinsettia Little",
      region: { x: 10, y: 4, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "poinsettia-big",
      name: "Poinsettia Big",
      region: { x: 11, y: 4, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "candy-1",
      name: "Candy 1",
      region: { x: 0, y: 5, width: 2, height: 2 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "candy-2",
      name: "Candy 2",
      region: { x: 2, y: 5, width: 2, height: 2 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "candy-3",
      name: "Candy 3",
      region: { x: 4, y: 5, width: 2, height: 2 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "gift-1",
      name: "Gift 1",
      region: { x: 6, y: 6, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "gift-2",
      name: "Gift 2",
      region: { x: 7, y: 6, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "gift-3",
      name: "Gift 3",
      region: { x: 8, y: 6, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#4a9c4a",
      category: "decoration",
    },
    {
      id: "gift-4",
      name: "Gift 4",
      region: { x: 9, y: 6, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "gift-5",
      name: "Gift 5",
      region: { x: 10, y: 6, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "candy-4",
      name: "Candy 4",
      region: { x: 0, y: 7, width: 2, height: 2 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "candy-5",
      name: "Candy 5",
      region: { x: 2, y: 7, width: 2, height: 2 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "candy-6",
      name: "Candy 6",
      region: { x: 4, y: 7, width: 2, height: 2 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "frozen-flower-1",
      name: "Frozen Flower 1",
      region: { x: 9, y: 5, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "frozen-flower-2",
      name: "Frozen Flower 2",
      region: { x: 10, y: 5, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "frozen-flower-3",
      name: "Frozen Flower 3",
      region: { x: 11, y: 5, width: 1, height: 1 },
      collision: { width: 1, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
  ],
}
