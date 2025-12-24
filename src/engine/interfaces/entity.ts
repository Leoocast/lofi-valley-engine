import type { Sprite } from "./sprites"

/**
 * Entity: Representa cualquier objeto colocable en el mundo del juego
 * (buildings, decoraciones, plantas, etc.)
 *
 * Combina información de posición (x, y) con datos del sprite que lo renderiza.
 * El footprint (width x height) define el área de colisión en el grid.
 */
export interface Entity {
  /** ID único de la entidad (usar crypto.randomUUID() al crear) */
  id: string

  /** Type discriminator for specific entity types */
  type?: string

  /** Posición X en el grid (en tiles, no píxeles) */
  x: number

  /** Posición Y en el grid (en tiles, no píxeles) */
  y: number

  /** Índice del sprite dentro del spritesheet (0, 1, 2...) */
  spriteIndex: number

  /** Referencia al sprite que define cómo renderizar esta entidad */
  sprite: Sprite

  /** Indica si la entidad puede ser destruida (default: true si tiene HP) */
  isDestructible?: boolean

  /** HP actual (health points) - opcional para entidades destructibles */
  hp?: number

  /** HP máximo - opcional para entidades destructibles */
  maxHp?: number

  /**
   * depth: Profundidad de renderizado para z-ordering (mayor = más adelante).
   * Usado para determinar qué entidades se dibujan primero.
   * Típicamente: depth = y * 100 + x
   */
  depth?: number

  /** Animación actual reproduciéndose (manejado por animationEngine) */
  currentAnimation?:
    | "shake"
    | "bounce"
    | "flash"
    | "hurt"
    | "squish"
    | "impact"
    | "chop"
    | "die"
}
