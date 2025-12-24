import React from "react"

import type { SheetSprite } from "@/engine/data/sprites/winterSprites"
import type { SpriteSheetData } from "@/engine/data/spritesheetData"
import type { Entity } from "@/engine/interfaces/entity"
import type { Sprite } from "@/engine/interfaces/sprites"

import { TILE_SIZE } from "@/engine/rendering/config"
import { getSheetSpriteStyle } from "@/engine/rendering/sheetSpriteRenderer"
import {
  getCollisionSize as getSheetCollisionSize,
  getVisualOffset as getSheetVisualOffset,
} from "@/engine/rendering/sheetSpriteUtils"
import {
  getCabinSpriteStyle,
  getCraftableSpriteStyle,
  getGrassSpriteStyle,
  getGroundSpriteStyle,
  renderEntity,
} from "@/engine/rendering/spritesheetRenderer"
import {
  getLogicalSize,
  getVisualOffset,
} from "@/engine/rendering/visualBoundsAndOffset"

interface EntitiesProps {
  entities: Entity[]
  mode: string
  mouseTile: { x: number; y: number } | null
  hoveredEntity: number | null
  timeOfDay: "day" | "afternoon" | "night"
  selectedSprite?: number
  placingDef?: Sprite
  selectedGroundTile?: number
  brushSize?: number
  canPlaceAt?: (
    x: number,
    y: number,
    options?: { ignoreId?: number; sprite?: Sprite; entity?: Entity },
  ) => boolean
  // New SheetSprite placement
  selectedSheetSprite?: {
    sprite: SheetSprite
    sheetData: SpriteSheetData<{ sprites: SheetSprite[] }>
  } | null
  canPlaceSheetSprite?: (x: number, y: number, sprite: SheetSprite) => boolean
  // New unified selection system (IDLE mode)
  selectionHoveredIdx?: number | null
  selectionSelectedIdx?: number | null
  selectionIsDragging?: boolean
  selectionDraggingIdx?: number | null // Entity being dragged
  selectionPreviewPos?: { x: number; y: number } | null // Ghost position
  selectionCanDrop?: boolean // For footprint color
}

/**
 * Entities Component
 *
 * Pure rendering component for all entities and their previews.
 * Displays:
 * - All entities sorted by depth
 * - Light overlays (night glow)
 * - Place mode preview (footprint + sprite)
 * - Paint mode preview (brush area)
 * - Move mode previews (hover + drag)
 * - Delete mode preview (red overlay)
 *
 * No game logic, just rendering based on props.
 * Reusable for Farm, Mine, Beach, Town, etc.
 */
export const Entities = React.memo<EntitiesProps>(
  ({
    entities,
    mode,
    mouseTile,
    hoveredEntity,
    timeOfDay,
    selectedSprite = 0,
    placingDef,
    selectedGroundTile = 0,
    brushSize = 1,
    canPlaceAt,
    selectedSheetSprite,
    canPlaceSheetSprite,
    // New unified selection
    selectionHoveredIdx,
    selectionSelectedIdx,
    selectionIsDragging,
    selectionDraggingIdx,
    selectionPreviewPos,
    selectionCanDrop,
  }) => (
    <React.Fragment>
      {(() => {
        /**
         * Sorting por depth: Ordena entidades por su posición Y + altura
         * para simular profundidad (objetos más al sur se dibujan adelante).
         *
         * depth = y + baseH (el borde inferior del footprint)
         */
        const sorted = entities
          .map((ent, idx) => ({ ent, idx }))
          .sort((a, b) => {
            // Check for SheetSprite
            const aSheet = (a.ent as Entity & { sheetSprite?: SheetSprite })
              .sheetSprite
            const bSheet = (b.ent as Entity & { sheetSprite?: SheetSprite })
              .sheetSprite
            const aSize = aSheet
              ? getSheetCollisionSize(aSheet)
              : getLogicalSize(a.ent.sprite)
            const bSize = bSheet
              ? getSheetCollisionSize(bSheet)
              : getLogicalSize(b.ent.sprite)
            const aDepth = a.ent.y + aSize.h
            const bDepth = b.ent.y + bSize.h
            return aDepth - bDepth
          })

        return sorted.map(({ ent: e, idx: i }) => {
          // Check for SheetSprite
          const sheetSprite = (e as Entity & { sheetSprite?: SheetSprite })
            .sheetSprite
          const size = sheetSprite
            ? getSheetCollisionSize(sheetSprite)
            : getLogicalSize(e.sprite)
          const visual = sheetSprite
            ? getSheetVisualOffset(sheetSprite)
            : getVisualOffset(e.sprite)
          const depth = (e.y + size.h) * 1000

          const hoverBrightness =
            mode === "place" && hoveredEntity === i ? "brightness(1.2)" : ""
          const nightGlow =
            timeOfDay === "night" &&
            e.sprite.id === "craftable" &&
            e.spriteIndex === 5
              ? "drop-shadow(0 0 30px rgba(255,220,100,1)) drop-shadow(0 0 15px rgba(255,200,100,0.8))"
              : ""

          // New unified selection outline (IDLE mode)
          const isSelectionHovered = selectionHoveredIdx === i
          const isSelectionSelected = selectionSelectedIdx === i
          const showSelectionOutline =
            (isSelectionHovered || isSelectionSelected) && !selectionIsDragging
          const selectionOutline = showSelectionOutline
            ? "drop-shadow(0 -2px 0 white) drop-shadow(0 2px 0 white) drop-shadow(-2px 0 0 white) drop-shadow(2px 0 0 white)"
            : ""

          const combinedFilter =
            [hoverBrightness, nightGlow, selectionOutline]
              .filter(Boolean)
              .join(" ") || "none"

          return (
            <div
              key={`entity-${i}`}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              style={{
                cursor:
                  selectionIsDragging && selectionDraggingIdx === i
                    ? "grabbing"
                    : showSelectionOutline
                      ? "grab"
                      : "auto",
                filter: combinedFilter,
                left: e.x * TILE_SIZE + visual.x,
                opacity:
                  mode === "paint"
                    ? 0.3
                    : selectionIsDragging && selectionDraggingIdx === i
                      ? 0.35
                      : mode === "place" && hoveredEntity === i
                        ? 1
                        : showSelectionOutline
                          ? 1
                          : 1,
                position: "absolute",
                top: e.y * TILE_SIZE + visual.y,
                // transform:
                //   selectionIsDragging && selectionDraggingIdx === i
                //     ? "scale(1.03)"
                //     : showSelectionOutline
                //       ? "scale(1.1)"
                //       : "scale(1)",
                transition: "opacity 80ms linear, transform 80ms linear",
                zIndex: depth,
                ...renderEntity(e),
              }}
            />
          )
        })
      })()}

      {/* LIGHT OVERLAYS - iluminación de alrededores en noche */}
      {timeOfDay === "night" &&
        entities.map((e, i) => {
          if (e.sprite.id === "craftable" && e.spriteIndex === 5) {
            const depth = (e.y + 1) * 1000
            const lightKey = `light-${e.id}`

            return (
              <div
                key={lightKey}
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,220,100,0.5) 0%, rgba(255,200,100,0.3) 30%, transparent 70%)",
                  height: TILE_SIZE * 6,
                  left: (e.x - 2.5) * TILE_SIZE,
                  mixBlendMode: "lighten",
                  pointerEvents: "none",
                  position: "absolute",
                  top: (e.y - 2.5) * TILE_SIZE,
                  width: TILE_SIZE * 6,
                  zIndex: depth + 1,
                }}
              />
            )
          }
          return null
        })}

      {/* PREVIEW PLACE MODE - Old Sprite format (skip if SheetSprite is selected) */}
      {mode === "place" && mouseTile && placingDef && !selectedSheetSprite
        ? (() => {
            const size = getLogicalSize(placingDef)
            const vo = getVisualOffset(placingDef)
            const can = canPlaceAt
              ? canPlaceAt(mouseTile.x, mouseTile.y, {
                  sprite: placingDef,
                })
              : false

            return (
              <React.Fragment>
                {/* footprint */}
                <div
                  style={{
                    background: can ? "rgba(0,255,0,0.4)" : "rgba(255,0,0,0.4)",
                    height: size.h * TILE_SIZE,
                    left: mouseTile.x * TILE_SIZE,
                    position: "absolute",
                    top: mouseTile.y * TILE_SIZE,
                    width: size.w * TILE_SIZE,
                    zIndex: (mouseTile.y + size.h) * 1000 - 10,
                  }}
                />
                {/* sprite preview */}
                <div
                  style={{
                    left: mouseTile.x * TILE_SIZE + vo.x,
                    opacity: 0.6,
                    pointerEvents: "none",
                    position: "absolute",
                    top: mouseTile.y * TILE_SIZE + vo.y,
                    zIndex: (mouseTile.y + size.h) * 1000,
                    ...(placingDef.id === "cabin"
                      ? getCabinSpriteStyle(selectedSprite)
                      : placingDef.id === "craftable"
                        ? getCraftableSpriteStyle(selectedSprite)
                        : selectedGroundTile === 0
                          ? getGrassSpriteStyle(selectedSprite)
                          : getGroundSpriteStyle(selectedSprite)),
                  }}
                />
              </React.Fragment>
            )
          })()
        : null}

      {/* PREVIEW PLACE MODE - SheetSprite */}
      {mode === "place" && mouseTile && selectedSheetSprite
        ? (() => {
            const { sprite, sheetData } = selectedSheetSprite
            const size = getSheetCollisionSize(sprite)
            const vo = getSheetVisualOffset(sprite)
            const offsetX = sprite.collision?.offsetX ?? 0
            const can = canPlaceSheetSprite
              ? canPlaceSheetSprite(mouseTile.x, mouseTile.y, sprite)
              : true

            return (
              <React.Fragment>
                {/* footprint */}
                <div
                  style={{
                    background: can ? "rgba(0,255,0,0.4)" : "rgba(255,0,0,0.4)",
                    height: size.h * TILE_SIZE,
                    left: (mouseTile.x + offsetX) * TILE_SIZE,
                    position: "absolute",
                    top: mouseTile.y * TILE_SIZE,
                    width: size.w * TILE_SIZE,
                    zIndex: (mouseTile.y + size.h) * 1000 - 10,
                  }}
                />
                {/* sprite preview */}
                <div
                  style={{
                    left: mouseTile.x * TILE_SIZE,
                    opacity: 0.6,
                    pointerEvents: "none",
                    position: "absolute",
                    top: mouseTile.y * TILE_SIZE + vo.y,
                    zIndex: (mouseTile.y + size.h) * 1000,
                    ...getSheetSpriteStyle(sprite, sheetData),
                  }}
                />
              </React.Fragment>
            )
          })()
        : null}

      {/* PREVIEW PAINT MODE */}
      {mode === "paint" && mouseTile && selectedGroundTile !== -1
        ? (() => {
            const radius = Math.floor(brushSize / 2)
            return (
              <React.Fragment>
                <div
                  style={{
                    border: "2px solid rgba(255, 200, 0, 0.6)",
                    height: (radius * 2 + 1) * TILE_SIZE,
                    left: (mouseTile.x - radius) * TILE_SIZE,
                    pointerEvents: "none",
                    position: "absolute",
                    top: (mouseTile.y - radius) * TILE_SIZE,
                    width: (radius * 2 + 1) * TILE_SIZE,
                    zIndex: 5000,
                  }}
                />
                {/* Sprite preview for center tile */}
                <div
                  style={{
                    ...(selectedGroundTile === 0
                      ? getGrassSpriteStyle(0)
                      : getGroundSpriteStyle(0)),
                    height: TILE_SIZE,
                    left: mouseTile.x * TILE_SIZE,
                    opacity: 0.4,
                    pointerEvents: "none",
                    position: "absolute",
                    top: mouseTile.y * TILE_SIZE,
                    width: TILE_SIZE,
                    zIndex: 5001,
                  }}
                />
              </React.Fragment>
            )
          })()
        : null}

      {/* SELECTION DRAG PREVIEW (IDLE mode ghost) */}
      {selectionIsDragging &&
        selectionDraggingIdx !== null &&
        selectionDraggingIdx !== undefined &&
        selectionPreviewPos &&
        (() => {
          const ent = entities[selectionDraggingIdx]
          if (!ent) return null
          const sheet = (ent as Entity & { sheetSprite?: SheetSprite })
            .sheetSprite
          const size = sheet
            ? getSheetCollisionSize(sheet)
            : getLogicalSize(ent.sprite)
          const vo = sheet
            ? getSheetVisualOffset(sheet)
            : getVisualOffset(ent.sprite)
          // Get collision offset for footprint positioning
          const collisionOffsetX = sheet?.collision?.offsetX ?? 0
          const depth = (selectionPreviewPos.y + size.h) * 1000

          return (
            <React.Fragment>
              {/* Footprint indicator */}
              <div
                style={{
                  background: selectionCanDrop
                    ? "rgba(0,255,0,0.4)"
                    : "rgba(255,0,0,0.4)",
                  height: size.h * TILE_SIZE,
                  left: (selectionPreviewPos.x + collisionOffsetX) * TILE_SIZE,
                  pointerEvents: "none",
                  position: "absolute",
                  top: selectionPreviewPos.y * TILE_SIZE,
                  width: size.w * TILE_SIZE,
                  zIndex: depth - 1,
                }}
              />
              {/* Ghost sprite */}
              <div
                style={{
                  left: selectionPreviewPos.x * TILE_SIZE + vo.x,
                  opacity: 0.5,
                  pointerEvents: "none",
                  position: "absolute",
                  top: selectionPreviewPos.y * TILE_SIZE + vo.y,
                  zIndex: depth,
                  ...renderEntity(ent),
                }}
              />
            </React.Fragment>
          )
        })()}
    </React.Fragment>
  ),
)

Entities.displayName = "Entities"
