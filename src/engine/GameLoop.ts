import { worldStore } from "./store"
import { CropGrowthSystem } from "./systems/CropGrowthSystem"
import { DropTickSystem } from "./systems/DropTickSystem"
import { TimeSystem } from "./systems/TimeSystem"
import { WaterEvaporationSystem } from "./systems/WaterEvaporationSystem"

/**
 * Sistema que puede ser actualizado en cada tick del loop
 */
export interface ISystem {
  update(): void
}

/**
 * GameLoop principal del juego.
 * Ejecuta la lógica de simulación a intervalos regulares (1 tick por segundo real).
 * Usa setInterval en lugar of requestAnimationFrame porque la simulación
 * avanza en steps discretos, no en frames continuos.
 */
export class GameLoop {
  private systems: ISystem[] = []
  private intervalId: number | null = null
  private readonly baseTickInterval = 1000 // 1 segundo real = 1 tick en x1

  constructor() {
    // Registrar sistemas de juego
    this.systems.push(new TimeSystem())
    this.systems.push(new WaterEvaporationSystem())
    this.systems.push(new CropGrowthSystem())
    this.systems.push(new DropTickSystem())
  }

  /**
   * Inicia el loop del juego
   */
  start(): void {
    if (this.intervalId !== null) {
      console.warn("GameLoop ya está corriendo")
      return
    }

    console.log("GameLoop iniciado")
    this.runLoop()
  }

  /**
   * Detiene el loop del juego
   */
  stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId)
      this.intervalId = null
      console.log("GameLoop detenido")
    }
  }

  /**
   * Ejecuta el loop con el intervalo ajustado según timeScale
   */
  private runLoop(): void {
    const state = worldStore.getState()
    const interval = this.baseTickInterval / state.timeScale // x1=1000ms, x2=500ms, x4=250ms, x8=125ms

    this.intervalId = window.setInterval(() => {
      this.tick()

      // Verificar si timeScale cambió y reiniciar con nuevo intervalo
      const currentScale = worldStore.getState().timeScale
      if (currentScale !== state.timeScale) {
        this.stop()
        this.runLoop()
      }
    }, interval)
  }

  /**
   * Ejecuta un tick de simulación
   * Llama a update() en todos los sistemas registrados
   */
  private tick(): void {
    for (const system of this.systems) {
      system.update()
    }
  }

  /**
   * Registra un nuevo sistema para ser actualizado en cada tick
   */
  registerSystem(system: ISystem): void {
    this.systems.push(system)
  }

  /**
   * Verifica si el loop está corriendo
   */
  isRunning(): boolean {
    return this.intervalId !== null
  }
}

// Instancia singleton del GameLoop
export const gameLoop = new GameLoop()
