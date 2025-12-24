import { worldActions } from "@/engine/store"

/**
 * Sistema de tiempo del juego.
 * Convierte tiempo real a tiempo del juego:
 * - 1 tick (1 segundo real) = 1 minuto en el juego
 * - 24 horas del juego = 1440 minutos = 1440 segundos reales = 24 minutos reales
 */
export class TimeSystem {
  /**
   * Actualiza el tiempo del juego.
   * Debe ser llamado en cada tick del GameLoop (cada 1 segundo real).
   */
  update(): void {
    worldActions.tick()
  }
}
