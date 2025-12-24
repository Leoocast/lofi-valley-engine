/**
 * spritesheetRenderer: Funciones para convertir sprites de un spritesheet
 * en estilos CSS listos para renderizar en React.
 *
 * Calcula la posición correcta dentro del spritesheet usando backgroundPosition
 * para extraer y mostrar un sprite específico.
 */

import { Terrain, terrainRegistry } from "../data/autotiling/terrainData"
import type { CropEntity } from "../interfaces/crops"
import type { Entity } from "../interfaces/entity"
import type { Spritesheet } from "../interfaces/spritesheets"

import {
  CABIN_SPRITESHEET,
  CRAFTABLE_SPRITESHEET,
  GRASS_SPRITESHEET,
  GROUND_SPRITESHEET,
  ROCK_SPRITESHEET,
  TREE_SPRITESHEET,
} from "../interfaces/spritesheets"
import { getCropSpriteStyle as getNewCropSpriteStyle } from "./cropRenderer"

/**
 * getSpriteStyle: Calcula los estilos CSS para renderizar un sprite individual
 * desde un spritesheet.
 *
 * Convierte un índice de sprite (0, 1, 2...) en la posición correcta dentro
 * del spritesheet usando backgroundPosition. Asume que los sprites están
 * organizados en una cuadrícula de izquierda a derecha, arriba a abajo.
 *
 * @param spriteSheet - Configuración del spritesheet (dimensiones y ruta)
 * @param index - Índice del sprite a extraer (0-based)
 * @returns Objeto con estilos CSS para aplicar al elemento
 *
 * @example
 * // Obtener el tercer sprite (índice 2) de un spritesheet
 * const styles = getSpriteStyle(CABIN_SPRITESHEET, 2)
 * <div style={styles} />
 */
function getSpriteStyle(spriteSheet: Spritesheet, index: number) {
  const { width, height, sheetWidth, sheetHeight, src } = spriteSheet

  // Calcular cuántos sprites caben por fila
  const spritesPerRow = sheetWidth / width

  // Calcular posición X,Y del sprite usando el índice
  const x = (index % spritesPerRow) * width
  const y = Math.floor(index / spritesPerRow) * height

  return {
    width,
    height,
    backgroundImage: `url(${src})`,
    backgroundSize: `${sheetWidth}px ${sheetHeight}px`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `-${x}px -${y}px`,
    imageRendering: "pixelated" as const, // Mantiene píxeles nítidos sin antialiasing
  }
}

/**
 * getCabinSpriteStyle: Wrapper para obtener estilos de sprites de cabañas.
 * @param index - Índice del sprite de cabaña (0-20, total 21 cabañas)
 */
export const getCabinSpriteStyle = (index: number) =>
  getSpriteStyle(CABIN_SPRITESHEET, index)

/**
 * getCraftableSpriteStyle: Wrapper para obtener estilos de sprites crafteables.
 * @param index - Índice del sprite crafteable (antorchas, cercas, etc.)
 */
export const getCraftableSpriteStyle = (index: number) =>
  getSpriteStyle(CRAFTABLE_SPRITESHEET, index)

/**
 * getGroundSpriteStyle: Wrapper para obtener estilos de sprites de suelo con autotiling.
 * @param index - Índice del sprite de suelo (0-15, variantes de autotiling)
 */
export const getGroundSpriteStyle = (index: number) =>
  getSpriteStyle(GROUND_SPRITESHEET, index)

/**
 * getGrassSpriteStyle: Wrapper para obtener estilos de sprites de pasto con autotiling.
 * @param index - Índice del sprite de pasto (0-15, variantes de autotiling)
 */
export const getGrassSpriteStyle = (index: number) =>
  getSpriteStyle(GRASS_SPRITESHEET, index)

/**
 * getGrassBlobSpriteStyle: Wrapper para nuevo grass tileset (usa autotiling)
 */
export const getGrassBlobSpriteStyle = (index: number) =>
  getSpriteStyle(terrainRegistry.getCachedSpritesheet(Terrain.GRASS), index)

export const getTreeSpriteStyle = (index: number) =>
  getSpriteStyle(TREE_SPRITESHEET, index)

export const getRockSpriteStyle = (index: number) =>
  getSpriteStyle(ROCK_SPRITESHEET, index)

/**
 * renderEntity: Obtiene los estilos CSS correctos para renderizar una entidad.
 *
 * Switch principal que determina qué función usar basándose en el tipo
 * de sprite de la entidad. Usado en el renderizado del grid.
 *
 * @param entity - La entidad a renderizar
 * @returns Objeto con estilos CSS, o {} si el tipo no existe
 *
 * @example
 * const entity = { sprite: { id: 'cabin' }, spriteIndex: 5, ... }
 * <div style={renderEntity(entity)} />
 */
export function renderEntity(entity: Entity) {
  // Handle new SheetSprite format
  const sheetEntity = entity as Entity & {
    sheetSprite?: {
      region: { x: number; y: number; width: number; height: number }
    }
    sheetSrc?: string
  }
  if (sheetEntity.sheetSprite && sheetEntity.sheetSrc) {
    const sprite = sheetEntity.sheetSprite
    const tileSize = 16 // Standard tile size
    const width = sprite.region.width * tileSize
    const height = sprite.region.height * tileSize
    const bgX = sprite.region.x * tileSize
    const bgY = sprite.region.y * tileSize

    return {
      width,
      height,
      backgroundImage: `url(/spritesheets/${sheetEntity.sheetSrc})`,
      backgroundPosition: `-${bgX}px -${bgY}px`,
      backgroundSize: "auto",
      backgroundRepeat: "no-repeat",
      imageRendering: "pixelated" as const,
    }
  }

  // Special handling for crops - use new cropRenderer
  if (entity.type === "crop") {
    const crop = entity as CropEntity
    // For dead crops, could show wilted sprite (TODO)
    const style = getNewCropSpriteStyle(
      crop.cropId,
      crop.currentStage === 0 ? "planted" : "stage",
      crop.currentStage,
      crop.isWatered, // Use crop's watered state
    )
    return style || {}
  }

  switch (entity.sprite.id) {
    case "cabin":
      return getCabinSpriteStyle(entity.spriteIndex)
    case "craftable":
      return getCraftableSpriteStyle(entity.spriteIndex)
    case "ground":
      return getGroundSpriteStyle(entity.spriteIndex)
    case "tree":
      return getTreeSpriteStyle(entity.spriteIndex)
    case "rock":
      return getRockSpriteStyle(entity.spriteIndex)
    default:
      return {}
  }
}
