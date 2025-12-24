import type { ISystem } from "../GameLoop"
import { worldStore } from "../store"

/**
 * Sistema que resetea el agua de todos los tiles a las 6:00 AM cada día
 */
export class WaterEvaporationSystem implements ISystem {
  private lastCheckedHour: number = -1

  update(): void {
    const state = worldStore.getState()
    const currentHour = state.gameTime.hour

    // Detectar cuando el reloj pasa a las 6:00 AM
    if (currentHour === 6 && this.lastCheckedHour !== 6) {
      // Resetear TODOS los tiles regados
      const updatedTiles = new Map(state.tilledSoil)
      let resetCount = 0

      updatedTiles.forEach((tile) => {
        if (tile.isWatered) {
          tile.isWatered = false
          tile.wateredAt = null
          resetCount++
        }
      })

      if (resetCount > 0) {
        worldStore.setState({ tilledSoil: updatedTiles })
      }
    }

    // Actualizar la última hora verificada
    this.lastCheckedHour = currentHour
  }
}
