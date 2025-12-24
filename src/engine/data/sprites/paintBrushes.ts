import { SpriteSheetData } from "../spritesheetData"
import type { SheetSprite } from "./winterSprites"

export const PAINT_BRUSHES_DATA: SpriteSheetData<{
  sprites: SheetSprite[]
}> = {
  meta: {
    src: "autotiling/brushes/paint-brushes.png",
    width: 528,
    height: 144,
    category: "Custom",
    tileWidth: 16,
    tileHeight: 16,
  },
  sprites: [
    {
      id: "darker-grass-terrain-preview",
      name: "darker-grass-terrain-preview",
      region: { x: 0, y: 0, width: 3, height: 3 },
    },
    {
      id: "grass-terrain-preview",
      name: "grass-terrain-preview",
      region: { x: 6, y: 0, width: 3, height: 3 },
    },
    {
      id: "soil-ground-terrain-preview",
      name: "soil-ground-terrain-preview",
      region: { x: 18, y: 0, width: 3, height: 3 },
    },
    {
      id: "darker-soil-ground-terrain-preview",
      name: "darker-soil-ground-terrain-preview",
      region: { x: 21, y: 0, width: 3, height: 3 },
    },
    {
      id: "sone-ground-terrain-preview",
      name: "sone-ground-terrain-preview",
      region: { x: 24, y: 0, width: 3, height: 3 },
    },
    {
      id: "darker_grass_ground_1",
      name: "darker_grass_ground_1",
      region: { x: 0, y: 3, width: 3, height: 3 },
    },
    {
      id: "darker_grass_ground_2",
      name: "darker_grass_ground_2",
      region: { x: 3, y: 3, width: 3, height: 3 },
    },
    {
      id: "grass_ground_1",
      name: "grass_ground_1",
      region: { x: 6, y: 3, width: 3, height: 3 },
    },
    {
      id: "grass_ground_2",
      name: "grass_ground_2",
      region: { x: 9, y: 3, width: 3, height: 3 },
    },
    {
      id: "snow_ground_1",
      name: "snow_ground_1",
      region: { x: 12, y: 3, width: 3, height: 3 },
    },
    {
      id: "snow_ground_2",
      name: "snow_ground_2",
      region: { x: 15, y: 3, width: 3, height: 3 },
    },
    {
      id: "darker_grass_hills",
      name: "darker_grass_hills",
      region: { x: 0, y: 6, width: 3, height: 3 },
    },
    {
      id: "grass_hills",
      name: "grass_hills",
      region: { x: 6, y: 6, width: 3, height: 3 },
    },
    {
      id: "snow_hills_1",
      name: "snow_hills_1",
      region: { x: 12, y: 6, width: 3, height: 3 },
    },
    {
      id: "snow_hills_2",
      name: "snow_hills_2",
      region: { x: 15, y: 6, width: 3, height: 3 },
    },
    {
      id: "soil_hills",
      name: "soil_hills",
      region: { x: 18, y: 6, width: 3, height: 3 },
    },
    {
      id: "darker_soil_hills",
      name: "darker_soil_hills",
      region: { x: 21, y: 6, width: 3, height: 3 },
    },
    {
      id: "stone_hills",
      name: "stone_hills",
      region: { x: 24, y: 6, width: 3, height: 3 },
    },
    {
      id: "dirt",
      name: "dirt",
      region: { x: 27, y: 3, width: 3, height: 3 },
    },
    {
      id: "dirt_wider",
      name: "dirt_wider",
      region: { x: 30, y: 3, width: 3, height: 3 },
    },
  ],
}
