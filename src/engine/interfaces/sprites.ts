import type { Spritesheet } from "./spritesheets"

import {
  CABIN_SPRITESHEET,
  CRAFTABLE_SPRITESHEET,
  CROPS_SPRITESHEET,
  GROUND_SPRITESHEET,
  ROCK_SPRITESHEET,
  TREE_SPRITESHEET,
} from "./spritesheets"

// ======================================================
// SPRITE DEFINITION
// ======================================================

/**
 * Sprite: Define las dimensiones físicas y visuales de un tipo de entidad.
 *
 * Separa dos conceptos importantes:
 * - **Footprint (base)**: Espacio físico que ocupa en el suelo para colisiones
 * - **Visual (real)**: Espacio total que ocupa visualmente en pantalla
 *
 * Ejemplo: Una cabaña puede ocupar 5x2 tiles en el suelo (base),
 * pero visualmente medir 5x7 tiles porque el sprite tiene altura extra.
 *
 * El sprite se renderiza con offset Y negativo para que su parte inferior
 * (base) coincida con el footprint, mientras el resto se extiende "hacia arriba".
 */
export interface Sprite {
  id: string

  name?: string
  /** Footprint lógico en el grid - ancho en tiles (colisión) */
  baseWidth: number //change this to collisionWidth
  /** Footprint lógico en el grid - alto en tiles (colisión) */
  baseHeight: number //change this to collisionHeight
  /** Ancho visual real en tiles (para renderizado) */
  realWidth: number
  /** Alto visual real en tiles (para renderizado) */
  realHeight: number
  /** Referencia al spritesheet que contiene la imagen */
  spriteSheet?: Spritesheet // Legacy

  /**
   * Offset del footprint base dentro del sprite visual (en tiles)
   * Por defecto (0, 0) = esquina superior izquierda del sprite
   * Ejemplo: árbol 3x5 con base en el centro-abajo = baseOffsetX: 1
   */
  baseOffsetX?: number
  baseOffsetY?: number

  /**
   * Hitboxes custom opcionales (en coordenadas de tiles relativas al sprite)
   * Si no se especifican, se usa el rectángulo completo (0, 0, realWidth, realHeight)
   * @example hitboxes: [{ x: 0, y: 0, w: 3, h: 4 }, { x: 1, y: 4, w: 1, h: 1 }]
   */
  hitboxes?: Array<{ x: number; y: number; w: number; h: number }>

  /**
   * Color para el minimapa (formato CSS)
   * @example minimapColor: "#4a9c4a" (verde para árboles)
   */
  minimapColor?: string
}

/**
 * CABIN_SPRITE: Sprite para edificios tipo cabaña/casa.
 *
 * - Footprint: 5x2 tiles (ocupa área grande en el suelo)
 * - Visual: 5x7 tiles (el sprite tiene 5 tiles extra de altura hacia arriba)
 * - Uso: Buildings grandes, casas, estructuras principales
 */
export const CABIN_SPRITE: Sprite = {
  id: "cabin",
  baseWidth: 5,
  baseHeight: 2,
  realWidth: 5,
  realHeight: 7,
  spriteSheet: CABIN_SPRITESHEET,
}

/**
 * CRAFTABLE_SPRITE: Sprite para objetos crafteables pequeños (antorchas, cercas, etc.)
 *
 * - Footprint: 1x1 tile (ocupa solo 1 tile en el suelo)
 * - Visual: 1x2 tiles (el sprite se extiende 1 tile hacia arriba)
 * - Uso: Decoraciones verticales, objetos pequeños con altura
 */
export const CRAFTABLE_SPRITE: Sprite = {
  id: "craftable",
  baseWidth: 1,
  baseHeight: 1,
  realWidth: 1,
  realHeight: 2,
  spriteSheet: CRAFTABLE_SPRITESHEET,
}

/**
 * GROUND_SPRITE: Sprite para tiles de suelo (plantas, cultivos, etc.)
 *
 * - Footprint: 1x1 tile
 * - Visual: 1x1 tile (plano, sin altura extra)
 * - Uso: Cultivos, plantas, tiles decorativos del suelo
 */
export const GROUND_SPRITE: Sprite = {
  id: "ground",
  baseWidth: 1,
  baseHeight: 1,
  realWidth: 1,
  realHeight: 1,
  spriteSheet: GROUND_SPRITESHEET,
  minimapColor: "#de8d5396",
}

export const TREE_SPRITE: Sprite = {
  id: "tree",
  baseWidth: 1,
  baseHeight: 1,
  realWidth: 3,
  realHeight: 5,
  spriteSheet: TREE_SPRITESHEET,
  baseOffsetX: 1, // Footprint en el tile central (no en la izquierda)
  hitboxes: [
    // Canopi: ocupa casi todo el sprite
    { x: 0, y: 0, w: 3, h: 4 },
    // Tronco: solo el tile central en la fila inferior
    { x: 1, y: 4, w: 1, h: 1 },
  ],
  minimapColor: "#4a9c4a", // Verde para árboles
}

export const ROCK_SPRITE: Sprite = {
  id: "rock",
  baseWidth: 1,
  baseHeight: 1,
  realWidth: 1,
  realHeight: 2,
  spriteSheet: ROCK_SPRITESHEET,
  minimapColor: "#808080", // Gris para rocas
}

/**
 * CROPS_SPRITE: Sprite para crops/cultivos con stages de crecimiento.
 *
 * - Footprint: 1x1 tile (ocupa 1 tile en el suelo)
 * - Visual: 1x2 tiles (sprite se extiende 1 tile hacia arriba)
 * - Uso: Todas las plantas cultivables (25 crops)
 */
export const CROPS_SPRITE: Sprite = {
  id: "crops",
  baseWidth: 1,
  baseHeight: 1,
  realWidth: 1,
  realHeight: 2,
  spriteSheet: CROPS_SPRITESHEET,
  minimapColor: "#90ee90", // Verde claro para crops
}
