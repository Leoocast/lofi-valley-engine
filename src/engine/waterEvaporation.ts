import { worldStore } from "./store"

/**
 * Sistema de evaporación de agua
 * Se ejecuta en el game loop cada tick
 */
export function updateWaterEvaporation() {
  const state = worldStore.getState()
  const currentGameTime = state.gameTime.totalMinutes
  const tilledSoil = state.tilledSoil

  let hasChanges = false
  const next = new Map(tilledSoil)

  // Iterar sobre todos los tiles mojados
  for (const [key, tile] of tilledSoil.entries()) {
    // Solo procesar tiles mojados sin crops
    if (!tile.isWatered || tile.hasCrop || tile.wateredAt === null) {
      continue
    }

    // Calcular tiempo transcurrido
    const minutesElapsed = currentGameTime - tile.wateredAt

    // Si pasaron >= 120 minutos, secar completamente
    if (minutesElapsed >= 120) {
      next.set(key, {
        ...tile,
        isWatered: false,
        wateredAt: null,
      })
      hasChanges = true
    }
  }

  // Solo actualizar si hubo cambios (evitar re-renders innecesarios)
  if (hasChanges) {
    worldStore.setState({ tilledSoil: next })
  }
}
