import { SpriteSheetData } from "../spritesheetData"
import type { SheetSprite } from "./winterSprites"

export const DECORATIONS_SLOPES_DATA: SpriteSheetData<{
  sprites: SheetSprite[]
}> = {
  meta: {
    src: "decorations/slopes.png",
    width: 192,
    height: 96,
    category: "Custom",
    tileWidth: 16,
    tileHeight: 16,
  },
  sprites: [
    {
      id: "darker-grass-slope-1",
      name: "Darker Grass Slope 1",
      region: { x: 0, y: 0, width: 2, height: 2 },
      collision: { width: 0, height: 0 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "darker-grass-slope-2",
      name: "Darker Grass Slope 2",
      region: { x: 2, y: 0, width: 2, height: 3 },
      collision: { width: 0, height: 0 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "darker-grass-slope-3",
      name: "Darker Grass Slope 3",
      region: { x: 4, y: 0, width: 2, height: 3 },
      collision: { width: 0, height: 0 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "grass-slope-",
      name: "Grass Slope ",
      region: { x: 0, y: 3, width: 2, height: 2 },
      collision: { width: 0, height: 0 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "grass-slope-2",
      name: "Grass Slope 2",
      region: { x: 2, y: 3, width: 2, height: 3 },
      collision: { width: 0, height: 0 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "grass-slope-3",
      name: "Grass Slope 3",
      region: { x: 4, y: 3, width: 2, height: 3 },
      collision: { width: 0, height: 0 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "soil-slope",
      name: "Soil Slope",
      region: { x: 6, y: 0, width: 2, height: 2 },
      collision: { width: 0, height: 0 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "darker-soil-slope",
      name: "Darker Soil Slope",
      region: { x: 8, y: 0, width: 2, height: 2 },
      collision: { width: 0, height: 0 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
    {
      id: "stone-ground-slope",
      name: "Stone Ground Slope",
      region: { x: 10, y: 0, width: 2, height: 2 },
      collision: { width: 0, height: 0 },
      minimapColor: "#a83eb9",
      category: "decoration",
    },
  ],
}
