/**
 * Ground Tiles Store for Laboratory
 *
 * Manages ground/terrain tiles for the lab paint mode.
 * Uses Zustand for synchronous updates to avoid React batching issues.
 */

import { create } from "zustand"

import type { GroundTile } from "./autotiling/groundAutotiling"

interface GroundTilesState {
  /** Map of ground tiles (key: "x-y") */
  groundTiles: Map<string, GroundTile>

  /** Version counter to force re-renders */
  version: number
}

interface GroundTilesActions {
  /** Set the entire ground tiles map */
  setGroundTiles: (tiles: Map<string, GroundTile>) => void

  /** Update tiles using a transformer function */
  updateGroundTiles: (
    fn: (prev: Map<string, GroundTile>) => Map<string, GroundTile>,
  ) => void

  /** Clear all ground tiles */
  clearGroundTiles: () => void
}

export const useGroundTilesStore = create<
  GroundTilesState & GroundTilesActions
>((set, get) => ({
  groundTiles: new Map(),
  version: 0,

  setGroundTiles: (tiles) => {
    set({ groundTiles: tiles, version: get().version + 1 })
  },

  updateGroundTiles: (fn) => {
    const current = get().groundTiles
    const updated = fn(current)
    set({ groundTiles: updated, version: get().version + 1 })
  },

  clearGroundTiles: () => {
    set({ groundTiles: new Map(), version: get().version + 1 })
  },
}))

// Non-hook access for use outside React components
export const groundTilesActions = {
  getGroundTiles: () => useGroundTilesStore.getState().groundTiles,
  setGroundTiles: (tiles: Map<string, GroundTile>) =>
    useGroundTilesStore.getState().setGroundTiles(tiles),
  updateGroundTiles: (
    fn: (prev: Map<string, GroundTile>) => Map<string, GroundTile>,
  ) => useGroundTilesStore.getState().updateGroundTiles(fn),
}
