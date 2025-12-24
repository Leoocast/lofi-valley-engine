import { SpriteSheetData } from "../spritesheetData"
import type { SheetSprite } from "./winterSprites"

export const DECORATIONS_BOATS_DATA: SpriteSheetData<{
  sprites: SheetSprite[]
}> = {
  meta: {
    src: "decorations/boats.png",
    width: 144,
    height: 96,
    category: "Custom",
    tileWidth: 16,
    tileHeight: 16,
  },
  sprites: [
    {
      id: "boat-1",
      name: "Boat 1",
      region: { x: 0, y: 0, width: 3, height: 2 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "boat-2",
      name: "Boat 2",
      region: { x: 3, y: 0, width: 3, height: 2 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "boat-3",
      name: "Boat 3",
      region: { x: 0, y: 2, width: 3, height: 2 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "boat-4",
      name: "Boat 4",
      region: { x: 3, y: 2, width: 3, height: 2 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "boat-5",
      name: "Boat 5",
      region: { x: 0, y: 4, width: 3, height: 2 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "boat-6",
      name: "Boat 6",
      region: { x: 3, y: 4, width: 3, height: 2 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "boat-7",
      name: "Boat 7",
      region: { x: 6, y: 4, width: 3, height: 2 },
      collision: { width: 1, height: 1, offsetX: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
  ],
}
