import { useEffect, useRef } from "react"

import { useGroundTilesStore } from "@/engine/groundTilesStore"
import type { Entity } from "@/engine/interfaces/entity"

import {
  entriesToGroundTiles,
  listFarms,
  loadFarm,
} from "@/services/farmStorage"

interface UseFarmAutoLoadOptions {
  setFarmId: (id: string | null) => void
  setFarmName: (name: string) => void
  setEntities: (entities: Entity[]) => void
  setGridWidth?: (width: number) => void
  setGridHeight?: (height: number) => void
}

/**
 * useFarmAutoLoad - Automatically loads the most recent farm on mount
 *
 * Loads the most recently updated farm from localStorage.
 * If no farms exist, starts with an empty farm.
 */
export function useFarmAutoLoad({
  setFarmId,
  setFarmName,
  setEntities,
  setGridWidth,
  setGridHeight,
}: UseFarmAutoLoadOptions): void {
  // Get store action directly to avoid stale closure issues
  const setGroundTiles = useGroundTilesStore((s) => s.setGroundTiles)

  // Use refs for React state setters
  const settersRef = useRef({
    setFarmId,
    setFarmName,
    setEntities,
    setGridWidth,
    setGridHeight,
  })
  settersRef.current = {
    setFarmId,
    setFarmName,
    setEntities,
    setGridWidth,
    setGridHeight,
  }

  useEffect(() => {
    const farms = listFarms()

    if (farms.length > 0) {
      const mostRecent = farms.sort((a, b) => b.updatedAt - a.updatedAt)[0]
      const farm = loadFarm(mostRecent.id)

      if (farm) {
        const {
          setFarmId,
          setFarmName,
          setEntities,
          setGridWidth,
          setGridHeight,
        } = settersRef.current

        // Set grid dimensions first to ensure viewport is ready
        if (setGridWidth && farm.data.width) {
          setGridWidth(farm.data.width)
        }
        if (setGridHeight && farm.data.height) {
          setGridHeight(farm.data.height)
        }

        // Then set farm data
        setFarmId(farm.id)
        setFarmName(farm.name)

        const tiles = entriesToGroundTiles(farm.data.groundTiles)
        setGroundTiles(tiles)
        setEntities(farm.data.entities)
      }
    }
  }, [setGroundTiles]) // Only depends on store action
}
