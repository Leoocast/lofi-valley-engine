import { worldStore, type WorldState } from "@/engine/store"
import { useStore } from "zustand"

/**
 * Hook de React para acceder al estado del mundo.
 *
 * IMPORTANTE: Usa selectores específicos para evitar re-renders innecesarios.
 *
 * ✅ BIEN:   const hour = useWorld(s => s.gameTime.hour);
 * ❌ MAL:    const { gameTime } = useWorld();
 *
 * El primer ejemplo solo re-renderizará cuando cambie la hora.
 * El segundo re-renderizará en CUALQUIER cambio del estado.
 */
export function useWorld<T>(selector: (state: WorldState) => T): T {
  return useStore(worldStore, selector)
}

/**
 * Hook para acceder al estado completo (usar con precaución)
 */
export function useWorldState(): WorldState {
  return useStore(worldStore)
}
