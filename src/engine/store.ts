import { createStore } from "zustand/vanilla"

import type { Entity } from "./interfaces/entity"

import { ROCK_SPRITE } from "./interfaces/sprites"

/**
 * Estado del tiempo del juego
 */
export interface GameTime {
  /** Hora del día (0-23) */
  hour: number
  /** Minuto de la hora (0-59) */
  minute: number
  /** Día actual (contador incremental) */
  day: number
  /** Total de minutos transcurridos desde el inicio */
  totalMinutes: number
}

/**
 * Tipos de herramientas disponibles
 */
export type Tool = "axe" | "pickaxe" | "hoe" | "wateringCan" | "scythe"

/**
 * Tile de tierra arada (tilled soil)
 */
export interface TilledTile {
  /** Índice de sprite para autotiling (0-15) */
  spriteIndex: number
  /** Si está regado (para regadera - futuro) */
  isWatered: boolean
  /** Timestamp de cuando se regó (para evaporación) */
  wateredAt: number | null
  /** ID de la crop plantada encima (futuro) */
  hasCrop: string | null
  /** Timestamp de creación para animación pop-in */
  createdAt: number
  /** Timestamp de eliminación para animación pop-out (null si no está siendo eliminado) */
  removedAt: number | null
}

/**
 * Estado global del mundo del juego
 */
export interface WorldState {
  /** Tiempo del juego */
  gameTime: GameTime
  /** Indica si el loop del juego está pausado */
  isPaused: boolean
  /** Velocidad de simulación (1.0 = normal, 2.0 = doble velocidad, etc.) */
  timeScale: number
  /** Herramienta actualmente seleccionada */
  activeTool: Tool | null
  /** Entidades del mundo (árboles, rocas, cultivos, etc.) */
  entities: Entity[]
  /** Tiles de tierra arada (mapa X-Y a TilledTile) */
  tilledSoil: Map<string, TilledTile>
}

/**
 * Crear entidades iniciales del mundo (árboles dummy para testing)
 */
const createInitialEntities = (): Entity[] => {
  const rocks = [
    {
      id: crypto.randomUUID(),
      x: 12,
      y: 5,
      spriteIndex: 0,
      sprite: ROCK_SPRITE,
      isDestructible: true,
      hp: 2,
      maxHp: 2,
    },
  ]

  return []
}

/**
 * Estado inicial del mundo
 */
const initialState: WorldState = {
  gameTime: {
    hour: 6, // Comenzar a las 6:00 AM
    minute: 0,
    day: 1,
    totalMinutes: 0,
  },
  isPaused: false,
  timeScale: 1.0,
  activeTool: null,
  entities: createInitialEntities(),
  tilledSoil: new Map(),
}

/**
 * Store vanilla de Zustand para el estado del mundo.
 * Este store es accedido directamente por el Engine (sin hooks).
 * Los componentes React deben usar el hook wrapper `useWorld`.
 */
export const worldStore = createStore<WorldState>(() => initialState)

/**
 * Acciones para manipular el estado del mundo
 */
export const worldActions = {
  /**
   * Avanza el tiempo del juego en 1 minuto
   */
  tick: () => {
    const state = worldStore.getState()
    if (state.isPaused) return

    const newTotalMinutes = state.gameTime.totalMinutes + 1
    let newMinute = state.gameTime.minute + 1
    let newHour = state.gameTime.hour
    let newDay = state.gameTime.day

    // Incrementar hora si pasamos de 59 minutos
    if (newMinute >= 60) {
      newMinute = 0
      newHour += 1
    }

    // Incrementar día si pasamos de 23 horas
    if (newHour >= 24) {
      newHour = 0
      newDay += 1
    }

    worldStore.setState({
      gameTime: {
        hour: newHour,
        minute: newMinute,
        day: newDay,
        totalMinutes: newTotalMinutes,
      },
    })
  },

  /**
   * Pausa el loop del juego
   */
  pause: () => {
    worldStore.setState({ isPaused: true })
  },

  /**
   * Reanuda el loop del juego
   */
  resume: () => {
    worldStore.setState({ isPaused: false })
  },

  /**
   * Alterna entre pausado y reanudado
   */
  togglePause: () => {
    const state = worldStore.getState()
    worldStore.setState({ isPaused: !state.isPaused })
  },

  /**
   * Establece la velocidad de simulación
   */
  setTimeScale: (scale: number) => {
    worldStore.setState({ timeScale: Math.max(0.1, scale) })
  },

  /**
   * Resetea el tiempo del juego al estado inicial
   */
  resetTime: () => {
    worldStore.setState({ gameTime: initialState.gameTime })
  },

  /**
   * Selecciona una herramienta
   */
  setActiveTool: (tool: Tool) => {
    worldStore.setState({ activeTool: tool })
  },

  /**
   * Deselecciona la herramienta actual
   */
  clearTool: () => {
    worldStore.setState({ activeTool: null })
  },
}
