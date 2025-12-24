export const FARM_WIDTH = 16
export const FARM_HEIGHT = 16

export const EDITOR_MODES = {
  IDLE: "idle",
  PLACE: "place",
  PAINT: "paint",
} as const

export type EditorMode = (typeof EDITOR_MODES)[keyof typeof EDITOR_MODES]

export const CURSOR_MAP: Record<EditorMode, string> = {
  [EDITOR_MODES.IDLE]: "default",
  [EDITOR_MODES.PLACE]: "crosshair",
  [EDITOR_MODES.PAINT]: "cell",
}
