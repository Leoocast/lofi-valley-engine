/**
 * Crops Ground Tiles Store
 *
 * Separate store for the crops view's ground/terrain tiles.
 * Independent from laboratory and game groundTilesStores.
 */

import { create } from "zustand"

import type { GroundTile } from "@/engine/autotiling/groundAutotiling"

interface CropsGroundTilesState {
  groundTiles: Map<string, GroundTile>
  version: number
}

interface CropsGroundTilesActions {
  setGroundTiles: (tiles: Map<string, GroundTile>) => void
  updateGroundTiles: (
    fn: (prev: Map<string, GroundTile>) => Map<string, GroundTile>,
  ) => void
  clearGroundTiles: () => void
}

export const useCropsGroundTilesStore = create<
  CropsGroundTilesState & CropsGroundTilesActions
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

// Non-hook access
export const cropsGroundTilesActions = {
  getGroundTiles: () => useCropsGroundTilesStore.getState().groundTiles,
  setGroundTiles: (tiles: Map<string, GroundTile>) =>
    useCropsGroundTilesStore.getState().setGroundTiles(tiles),
  updateGroundTiles: (
    fn: (prev: Map<string, GroundTile>) => Map<string, GroundTile>,
  ) => useCropsGroundTilesStore.getState().updateGroundTiles(fn),
}
