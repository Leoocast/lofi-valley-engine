import { SpriteSheetData } from "../spritesheetData"
import type { SheetSprite } from "./winterSprites"

export const DECORATIONS_WATER_WELL_DATA: SpriteSheetData<{
  sprites: SheetSprite[]
}> = {
  meta: {
    src: "decorations/water_well.png",
    width: 32,
    height: 32,
    category: "Custom",
    tileWidth: 16,
    tileHeight: 16,
  },
  sprites: [
    {
      id: "water-well",
      name: "Water Well",
      region: { x: 0, y: 0, width: 2, height: 2 },
      collision: { width: 2, height: 1 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
  ],
}
