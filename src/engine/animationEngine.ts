import { worldStore } from "./store"

/**
 * Tipos de animaciones disponibles
 */
export type EntityAnimation =
  | "shake"
  | "bounce"
  | "flash"
  | "hurt"
  | "squish"
  | "impact" // Cartoon diagonal stretch
  | "chop" // Cartoon chop - base fija, skew arriba-izquierda
  | "die" // Death animation - fade + fall

/**
 * Constantes de animaciones (para evitar magic strings)
 */
export const ANIMATIONS = {
  SHAKE: "shake" as EntityAnimation,
  BOUNCE: "bounce" as EntityAnimation,
  FLASH: "flash" as EntityAnimation,
  HURT: "hurt" as EntityAnimation,
  SQUISH: "squish" as EntityAnimation,
  IMPACT: "impact" as EntityAnimation, // Cartoon hit - diagonal stretch
  CHOP: "chop" as EntityAnimation, // Tree chop - fixed base
  DIE: "die" as EntityAnimation, // Entity death
} as const

/**
 * Configuración de duración por tipo de animación (en ms)
 * Exportada para uso en componentes de rendering
 */
export const ANIMATION_DURATIONS: Record<EntityAnimation, number> = {
  shake: 200,
  bounce: 300,
  flash: 150,
  hurt: 250,
  squish: 400,
  impact: 350,
  chop: 300,
  die: 200, // Pop rápido
}

/**
 * Reproduce una animación en una entidad y limpia automáticamente
 *
 * @param entityId - ID de la entidad a animar
 * @param animation - Tipo de animación a reproducir
 *
 * @example
 * playEntityAnimation(tree.id, "shake")
 * playEntityAnimation(rock.id, "hurt")
 */
export const playEntityAnimation = (
  entityId: string,
  animation: EntityAnimation,
): void => {
  const duration = ANIMATION_DURATIONS[animation]

  // Activar animación
  worldStore.setState((state) => ({
    entities: state.entities.map((e) =>
      e.id === entityId ? { ...e, currentAnimation: animation } : e,
    ),
  }))

  // Limpiar automáticamente después de la duración
  setTimeout(() => {
    worldStore.setState((state) => ({
      entities: state.entities.map((e) =>
        e.id === entityId ? { ...e, currentAnimation: undefined } : e,
      ),
    }))
  }, duration)
}

/**
 * Cancela cualquier animación activa de una entidad
 * Útil si la entidad es destruida antes de que termine la animación
 */
export const cancelEntityAnimation = (entityId: string): void => {
  worldStore.setState((state) => ({
    entities: state.entities.map((e) =>
      e.id === entityId ? { ...e, currentAnimation: undefined } : e,
    ),
  }))
}
