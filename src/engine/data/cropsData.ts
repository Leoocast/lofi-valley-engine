import type { SpriteSheetData } from "./spritesheetData"

export interface Crop {
  id: string
  name: string
  spanishName: string
  isFantasy: boolean
  growthStages: number
  tallStages: number[]
  lifeCycle: {
    isPerennial: boolean
    growthTimePerStage: number
    waterCheckInterval: number
    deathTimeWithoutWater: number
    deathTimeWithoutHarvest: number
  }
  harvest: {
    maxHarvests: number
    minDrops: number
    maxDrops: number
  }
  items: {
    seedId: string
    seedName: string
    harvestId: string
    harvestName: string
  }
}

export const DEFAULT_LIFECYCLE = {
  isPerennial: false,
  growthTimePerStage: 5,
  waterCheckInterval: 1440,
  deathTimeWithoutWater: Infinity,
  deathTimeWithoutHarvest: Infinity,
}

export const DEFAULT_HARVEST = {
  maxHarvests: 1,
  minDrops: 1,
  maxDrops: 2,
}

export const ITEM_DEFAULTS = {
  seed: { stackable: true, maxStack: 99 },
  harvest: { stackable: true, maxStack: 999 },
}

// Helper to generate item IDs from crop ID
function createItems(cropId: string, name: string, spanishName: string) {
  const base = cropId.replace("-crop", "")
  return {
    seedId: `${base}-seed`,
    seedName: `${name} Seed`,
    harvestId: `${base}-harvest`,
    harvestName: name,
  }
}

export const CROPS_DATA: SpriteSheetData<{ crops: Crop[] }> = {
  meta: {
    src: "cropsV2.png",
    width: 256,
    height: 528,
    category: "Crops",
  },
  crops: [
    {
      id: "corn-crop",
      name: "Corn",
      spanishName: "Maíz",
      isFantasy: false,
      tallStages: [5, 6],
      growthStages: 6,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 720 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("corn-crop", "Corn", "Maíz"),
    },
    {
      id: "carrot-crop",
      name: "Carrot",
      spanishName: "Zanahoria",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 240 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("carrot-crop", "Carrot", "Zanahoria"),
    },
    {
      id: "cauliflower-crop",
      name: "Cauliflower",
      spanishName: "Coliflor",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 480 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("cauliflower-crop", "Cauliflower", "Coliflor"),
    },
    {
      id: "purple-onion-crop",
      name: "Purple Onion",
      spanishName: "Cebolla Morada",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 360 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("purple-onion-crop", "Purple Onion", "Cebolla Morada"),
    },
    {
      id: "eggplant-crop",
      name: "Eggplant",
      spanishName: "Berenjena",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 540 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("eggplant-crop", "Eggplant", "Berenjena"),
    },
    {
      id: "blue-flower-crop",
      name: "Tulip",
      spanishName: "Tulipán",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 180 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("blue-flower-crop", "Tulip", "Tulipán"),
    },
    {
      id: "lettuce-crop",
      name: "Lettuce",
      spanishName: "Lechuga",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 120 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("lettuce-crop", "Lettuce", "Lechuga"),
    },
    {
      id: "wheat-crop",
      name: "Wheat",
      spanishName: "Trigo",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 600 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("rice-crop", "Wheat", "Trigo"),
    },
    {
      id: "pumpkin-crop",
      name: "Pumpkin",
      spanishName: "Calabaza",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 1200 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("pumpkin-crop", "Pumpkin", "Calabaza"),
    },
    {
      id: "turnip-crop",
      name: "Turnip",
      spanishName: "Nabo",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 300 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("turnip-crop", "Turnip", "Nabo"),
    },
    {
      id: "cabbage-crop",
      name: "Cabbage",
      spanishName: "Repollo",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 420 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("cabbage-crop", "Cabbage", "Repollo"),
    },
    {
      id: "radish-crop",
      name: "Radish",
      spanishName: "Rábano",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 150 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("radish-crop", "Radish", "Rábano"),
    },
    {
      id: "blue-star-crop",
      name: "Blue Star",
      spanishName: "Estrella Azul",
      isFantasy: true,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 2160 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("blue-star-crop", "Blue Star", "Estrella Azul"),
    },
    {
      id: "cucumber-crop",
      name: "Cucumber",
      spanishName: "Pepino",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 280 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("cucumber-crop", "Cucumber", "Pepino"),
    },
    {
      id: "sunflower-crop",
      name: "Sunflower",
      spanishName: "Girasol",
      isFantasy: false,
      tallStages: [4, 5],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 660 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("sunflower-crop", "Sunflower", "Girasol"),
    },
    {
      id: "ginger-crop",
      name: "Ginger",
      spanishName: "Jengibre",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 840 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("ginger-crop", "Ginger", "Jengibre"),
    },
    {
      id: "potato-crop",
      name: "Potato",
      spanishName: "Papa",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 450 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("potato-crop", "Potato", "Papa"),
    },
    {
      id: "watermelon-crop",
      name: "Watermelon",
      spanishName: "Sandía",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 1440 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("watermelon-crop", "Watermelon", "Sandía"),
    },
    {
      id: "starfruit-crop",
      name: "Starfruit",
      spanishName: "Carambola",
      isFantasy: true,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 2400 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("starfruit-crop", "Starfruit", "Carambola"),
    },
    {
      id: "moonflower-crop",
      name: "Moonflower",
      spanishName: "Flor Lunar",
      isFantasy: true,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 2880 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("moonflower-crop", "Moonflower", "Flor Lunar"),
    },
    {
      id: "banana-crop",
      name: "Banana",
      spanishName: "Plátano",
      isFantasy: false,
      tallStages: [4, 5],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 960 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("banana-crop", "Banana", "Plátano"),
    },
    {
      id: "pineapple-crop",
      name: "Pineapple",
      spanishName: "Piña",
      isFantasy: false,
      tallStages: [4, 5],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 1680 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("pineapple-crop", "Pineapple", "Piña"),
    },
    {
      id: "melon-crop",
      name: "Melon",
      spanishName: "Melón",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 1080 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("melon-crop", "Melon", "Melón"),
    },
    {
      id: "garlic-crop",
      name: "Garlic",
      spanishName: "Ajo",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 520 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("garlic-crop", "Garlic", "Ajo"),
    },
    {
      id: "red-pepper-crop",
      name: "Red Pepper",
      spanishName: "Pimiento Rojo",
      isFantasy: false,
      tallStages: [4, 5],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 780 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("red-pepper-crop", "Red Pepper", "Pimiento Rojo"),
    },
    {
      id: "rare-crop",
      name: "Rare",
      spanishName: "Raro",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 200 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("rare-crop", "Rare", "Raro"),
    },
    {
      id: "blue-carrot-crop",
      name: "Blue Carrot",
      spanishName: "Zanahoria Azul",
      isFantasy: true,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 1920 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("blue-carrot-crop", "Blue Carrot", "Zanahoria Azul"),
    },
    {
      id: "broccoli-crop",
      name: "Broccoli",
      spanishName: "Brócoli",
      isFantasy: false,
      tallStages: [],
      growthStages: 5,
      lifeCycle: { ...DEFAULT_LIFECYCLE, growthTimePerStage: 390 },
      harvest: { ...DEFAULT_HARVEST },
      items: createItems("broccoli-crop", "Broccoli", "Brócoli"),
    },
  ],
}
