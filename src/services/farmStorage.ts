/**
 * Farm Storage Service
 *
 * Handles saving/loading multiple farms to localStorage
 * and sharing via URL with Base64 encoding.
 */

import type { GroundTile } from "@/engine/autotiling/groundAutotiling"
import type { Entity } from "@/engine/interfaces/entity"

// ============ TYPES ============

export interface FarmSaveData {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  version: number
  data: {
    groundTiles: [string, GroundTile][] // Map serialized as entries
    entities: Entity[]
    width: number
    height: number
  }
}

interface FarmListItem {
  id: string
  name: string
  updatedAt: number
}

// ============ CONSTANTS ============

const STORAGE_KEY_LIST = "lofi-valley-farms"
const STORAGE_KEY_PREFIX = "lofi-valley-farm-"
const CURRENT_VERSION = 1

// ============ LOCAL STORAGE ============

/**
 * Save a farm to localStorage
 */
export function saveFarm(
  id: string,
  name: string,
  groundTiles: Map<string, GroundTile>,
  entities: Entity[],
  width: number,
  height: number,
): FarmSaveData {
  const now = Date.now()

  // Check if farm exists (for updatedAt)
  const existing = loadFarm(id)

  const farmData: FarmSaveData = {
    id,
    name,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    version: CURRENT_VERSION,
    data: {
      groundTiles: Array.from(groundTiles.entries()),
      entities,
      width,
      height,
    },
  }

  // Save farm data
  localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(farmData))

  // Update farm list
  const list = listFarms()
  const existingIndex = list.findIndex((f) => f.id === id)
  const listItem: FarmListItem = { id, name, updatedAt: now }

  if (existingIndex >= 0) {
    list[existingIndex] = listItem
  } else {
    list.push(listItem)
  }

  localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(list))

  return farmData
}

/**
 * Load a farm from localStorage by ID
 */
export function loadFarm(id: string): FarmSaveData | null {
  const raw = localStorage.getItem(STORAGE_KEY_PREFIX + id)
  if (!raw) return null

  try {
    return JSON.parse(raw) as FarmSaveData
  } catch {
    return null
  }
}

/**
 * List all saved farms (metadata only)
 */
export function listFarms(): FarmListItem[] {
  const raw = localStorage.getItem(STORAGE_KEY_LIST)
  if (!raw) return []

  try {
    return JSON.parse(raw) as FarmListItem[]
  } catch {
    return []
  }
}

/**
 * Delete a farm from localStorage
 */
export function deleteFarm(id: string): void {
  localStorage.removeItem(STORAGE_KEY_PREFIX + id)

  const list = listFarms().filter((f) => f.id !== id)
  localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(list))
}

/**
 * Convert GroundTile entries back to Map
 */
export function entriesToGroundTiles(
  entries: [string, GroundTile][],
): Map<string, GroundTile> {
  return new Map(entries)
}

// ============ URL SHARING ============

/**
 * Create a shareable URL for a farm
 * Returns null if data is too large
 */
export function createShareUrl(farm: FarmSaveData): string | null {
  try {
    const json = JSON.stringify(farm)
    const base64 = btoa(encodeURIComponent(json))

    // Check URL length limit (~2000 chars safe)
    if (base64.length > 1800) {
      console.warn("Farm data too large for URL sharing")
      return null
    }

    const url = new URL(window.location.href)
    url.hash = `farm=${base64}`
    return url.toString()
  } catch (e) {
    console.error("Failed to create share URL:", e)
    return null
  }
}

/**
 * Parse farm data from current URL hash
 */
export function parseFarmFromUrl(): FarmSaveData | null {
  try {
    const hash = window.location.hash
    if (!hash.startsWith("#farm=")) return null

    const base64 = hash.slice(6) // Remove "#farm="
    const json = decodeURIComponent(atob(base64))
    return JSON.parse(json) as FarmSaveData
  } catch (e) {
    console.error("Failed to parse farm from URL:", e)
    return null
  }
}

/**
 * Download farm as JSON file (fallback for large farms)
 */
export function downloadFarmAsFile(farm: FarmSaveData): void {
  const json = JSON.stringify(farm, null, 2)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `${farm.name.replace(/[^a-z0-9]/gi, "_")}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Import farm from JSON file
 */
export function importFarmFromFile(file: File): Promise<FarmSaveData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string
        const farm = JSON.parse(json) as FarmSaveData
        resolve(farm)
      } catch (err) {
        reject(new Error("Invalid farm file"))
      }
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}

/**
 * Generate a new unique farm ID
 */
export function generateFarmId(): string {
  return crypto.randomUUID()
}
