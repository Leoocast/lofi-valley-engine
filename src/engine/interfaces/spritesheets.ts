/**
 * Spritesheet: Define las dimensiones y ubicación de un archivo PNG de spritesheet.
 */

export interface Spritesheet {
  /** Ancho en píxeles de UN sprite individual dentro del sheet */
  width: number

  /** Alto en píxeles de UN sprite individual dentro del sheet */
  height: number

  /** Ancho total en píxeles del archivo PNG completo */
  sheetWidth: number

  /** Alto total en píxeles del archivo PNG completo */
  sheetHeight: number

  /** Ruta al archivo PNG del spritesheet (ej: "/spritesheets/cabins.png") */
  src: string
}

/**
 * getSrc: Helper para construir rutas de spritesheet de forma consistente.
 * Convierte un nombre corto en la ruta completa del archivo.
 *
 * @example getSrc("cabins") → "/spritesheets/cabins.png"
 */
const getSrc = (_src: string) => `/spritesheets/${_src}.png`

/**
 * CABIN_SPRITESHEET: Spritesheet de edificios tipo cabaña (80x112px por sprite).
 *
 * - Sprite individual: 80x112 píxeles
 * - Sheet completo: 240x784 píxeles
 * - Organización: 3 sprites por fila (240÷80 = 3)
 * - Total sprites: 21 cabañas diferentes
 * - Archivo: /spritesheets/cabins.png
 */
export const CABIN_SPRITESHEET: Spritesheet = {
  width: 80,
  height: 112,
  sheetWidth: 240,
  sheetHeight: 784,
  src: getSrc("cabins"),
}

/**
 * CRAFTABLE_SPRITESHEET: Spritesheet de objetos crafteables (16x32px por sprite).
 *
 * - Sprite individual: 16x32 píxeles (1 tile ancho x 2 tiles alto)
 * - Sheet completo: 128x1408 píxeles
 * - Organización: 8 sprites por fila (128÷16 = 8)
 * - Incluye: antorchas, cercas, letreros, decoraciones pequeñas
 * - Archivo: /spritesheets/craftables.png
 */
export const CRAFTABLE_SPRITESHEET: Spritesheet = {
  width: 16,
  height: 32,
  sheetWidth: 128,
  sheetHeight: 1408,
  src: getSrc("craftables"),
}

/**
 * GROUND_SPRITESHEET: Spritesheet de tiles de suelo con autotiling (16x16px por sprite).

 * - Archivo: /spritesheets/autotiling/ground.png
 */
export const GROUND_SPRITESHEET: Spritesheet = {
  width: 16,
  height: 16,
  sheetWidth: 64,
  sheetHeight: 64,
  src: "/spritesheets/autotiling_OLD/ground.png",
}

/**
 * GRASS_SPRITESHEET: Spritesheet de tiles de pasto con autotiling (16x16px por sprite).
 *
 * - Sprite individual: 16x16 píxeles (1 tile x 1 tile)
 * - Sheet completo: 256x16 píxeles (16 variantes de autotiling en horizontal)p
 * - Organización: 16 sprites en una fila (256÷16 = 16)
 * - Bitmask 0-15: Cada posición corresponde a una variante de autotiling
 * - Archivo: /spritesheets/autotiling/grass.png
 */
export const GRASS_SPRITESHEET: Spritesheet = {
  width: 16,
  height: 16,
  sheetWidth: 64,
  sheetHeight: 64,
  src: "/spritesheets/autotiling_OLD/grass.png",
}

/**
 * WATERED_GROUND_SPRITESHEET: Spritesheet de tierra mojada con autotiling (16x16px por sprite).
 *
 * - Sprite individual: 16x16 píxeles (1 tile x 1 tile)
 * - Sheet completo: 64x64 píxeles (4x4 = 16 variantes de autotiling)
 * - Organización: 4 columnas x 4 filas = 16 sprites
 * - Bitmask 0-15: Cada posición corresponde a una variante de autotiling
 * - Archivo: /spritesheets/autotiling/watered_ground.png
 * - Uso: Overlay encima de GROUND_SPRITESHEET cuando isWatered = true
 */
export const WATERED_GROUND_SPRITESHEET: Spritesheet = {
  width: 16,
  height: 16,
  sheetWidth: 64,
  sheetHeight: 64,
  src: "/spritesheets/autotiling_OLD/watered_ground.png",
}

/**
 * CROPS_SPRITESHEET: Spritesheet de crops con stages de crecimiento (16x32px por sprite).
 *
 * - Sprite individual: 16x32 píxeles (1 tile ancho x 2 tiles alto)
 * - Sheet completo: 256x416 píxeles
 * - Organización: 16 sprites por fila, 13 filas
 * - Total crops: 25 (2 crops por fila en filas 0-11, 1 en fila 12)
 * - Cada crop: 8 slots (2 semillas, 5 stages, 1 permanente)
 * - Sprites 12-15: Marchitados genéricos
 * - Archivo: /spritesheets/crops.png
 */
export const CROPS_SPRITESHEET: Spritesheet = {
  width: 16,
  height: 32,
  sheetWidth: 256,
  sheetHeight: 416,
  src: "/spritesheets/crops.png",
}

export const TREE_SPRITESHEET: Spritesheet = {
  width: 48,
  height: 80,
  sheetWidth: 48,
  sheetHeight: 80,
  src: "/spritesheets/tree.png",
}

export const ROCK_SPRITESHEET: Spritesheet = {
  width: 16,
  height: 16,
  sheetWidth: 16,
  sheetHeight: 16,
  src: "/spritesheets/rock.png",
}

export const SEED_PACKET_SPRITESHEET: Spritesheet = {
  width: 16,
  height: 16,
  sheetWidth: 16,
  sheetHeight: 16,
  src: "/spritesheets/seeds_packet.png",
}

/**
 * WATER_SPRITESHEET: Spritesheet de agua animada (16x16px por sprite).
 *
 * - Sprite individual: 16x16 píxeles (1 tile x 1 tile)
 * - Sheet completo: 64x16 píxeles (4 frames de animación en horizontal)
 * - Organización: 4 frames en una fila (64÷16 = 4)
 * - Uso: Fondo animado para el laboratorio
 * - Archivo: /spritesheets/autotiling/water/Water-spritesheet.png
 */
export const WATER_SPRITESHEET: Spritesheet = {
  width: 16,
  height: 16,
  sheetWidth: 64,
  sheetHeight: 16,
  src: "/spritesheets/autotiling/water/Water-spritesheet.png",
}
