export interface MetaInfo {
  src: string
  width: number
  height: number
  category: string

  tileWidth?: number
  tileHeight?: number
}

export type SpriteSheetData<T> = {
  meta: MetaInfo
} & T

/**
 * Convert SpriteSheetData to legacy Spritesheet format
 * Used for compatibility with existing rendering code
 */
export function toSpritesheet(data: SpriteSheetData<unknown>): {
  width: number
  height: number
  sheetWidth: number
  sheetHeight: number
  src: string
} {
  return {
    width: data.meta.tileWidth ?? 16,
    height: data.meta.tileHeight ?? 16,
    sheetWidth: data.meta.width,
    sheetHeight: data.meta.height,
    src: `/spritesheets/${data.meta.src}`,
  }
}
