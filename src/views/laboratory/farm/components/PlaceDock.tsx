/**
 * PlaceDock - Floating panel for placing entities on the map
 */

import React, { useEffect, useRef, useState } from "react"

import { DECORATIONS_BOATS_DATA } from "@/engine/data/sprites/boats"
import { DECORATIONS_MUSHROOMS_FLOWERS_STONES_DATA } from "@/engine/data/sprites/mushroomsDeco"
import { DECORATIONS_SLOPES_DATA } from "@/engine/data/sprites/slopes"
import { RESOURCES_TREES_DATA } from "@/engine/data/sprites/trees"
import { DECORATIONS_WATER_WELL_DATA } from "@/engine/data/sprites/waterWell"
import {
  WINTER_SPRITES_DATA,
  type SheetSprite,
} from "@/engine/data/sprites/winterSprites"
import type { SpriteSheetData } from "@/engine/data/spritesheetData"
import { type EditorMode } from "../farm_config"

// Helper to get size string from sprite
const getSizeString = (sprite: SheetSprite): string => {
  const collision = sprite.collision
  if (collision) {
    return `${collision.width}×${collision.height}`
  }
  return `${sprite.region.width}×${sprite.region.height}`
}

// Group winter sprites by sub-category
const winterTrees = WINTER_SPRITES_DATA.sprites.filter(
  (s) =>
    s.id.includes("tree") ||
    s.id.includes("bush") ||
    s.id.includes("christmas"),
)
const winterDecorations = WINTER_SPRITES_DATA.sprites.filter(
  (s) =>
    s.id.includes("snowman") ||
    s.id.includes("snow-man") ||
    s.id.includes("candy") ||
    s.id.includes("gift") ||
    s.id.includes("poinsettia") ||
    s.id.includes("teemo") ||
    s.id.includes("frozen"),
)

// Entity categories with sprite data
const ENTITY_CATEGORIES = [
  {
    id: "trees",
    label: "Trees",
    icon: "🌳",
    sheetData: RESOURCES_TREES_DATA,
    items: RESOURCES_TREES_DATA.sprites.map((sprite) => ({
      id: sprite.id,
      name: sprite.name,
      icon: "🌳",
      size: getSizeString(sprite),
      sprite,
    })),
  },
  {
    id: "mushrooms-flowers",
    label: "Mushrooms & Flowers",
    icon: "🍄",
    sheetData: DECORATIONS_MUSHROOMS_FLOWERS_STONES_DATA,
    items: DECORATIONS_MUSHROOMS_FLOWERS_STONES_DATA.sprites.map((sprite) => ({
      id: sprite.id,
      name: sprite.name,
      icon: "🍄",
      size: getSizeString(sprite),
      sprite,
    })),
  },
  {
    id: "water-well",
    label: "Water Well",
    icon: "🪣",
    sheetData: DECORATIONS_WATER_WELL_DATA,
    items: DECORATIONS_WATER_WELL_DATA.sprites.map((sprite) => ({
      id: sprite.id,
      name: sprite.name,
      icon: "🪣",
      size: getSizeString(sprite),
      sprite,
    })),
  },
  {
    id: "boats",
    label: "Boats",
    icon: "⛵",
    sheetData: DECORATIONS_BOATS_DATA,
    items: DECORATIONS_BOATS_DATA.sprites.map((sprite) => ({
      id: sprite.id,
      name: sprite.name,
      icon: "⛵",
      size: getSizeString(sprite),
      sprite,
    })),
  },
  {
    id: "slopes",
    label: "Slopes",
    icon: "📐",
    sheetData: DECORATIONS_SLOPES_DATA,
    items: DECORATIONS_SLOPES_DATA.sprites.map((sprite) => ({
      id: sprite.id,
      name: sprite.name,
      icon: "📐",
      size: getSizeString(sprite),
      sprite,
    })),
  },
  {
    id: "winter-trees",
    label: "Winter Trees",
    icon: "🌲",
    sheetData: WINTER_SPRITES_DATA,
    items: winterTrees.map((sprite) => ({
      id: sprite.id,
      name: sprite.name,
      icon: "🌲",
      size: getSizeString(sprite),
      sprite,
    })),
  },
  {
    id: "winter-decor",
    label: "Winter Decor",
    icon: "⛄",
    sheetData: WINTER_SPRITES_DATA,
    items: winterDecorations.map((sprite) => ({
      id: sprite.id,
      name: sprite.name,
      icon: "⛄",
      size: getSizeString(sprite),
      sprite,
    })),
  },
]

interface PlaceDockProps {
  onPlaceItem?: (
    itemId: string,
    sprite: SheetSprite | null,
    sheetData: SpriteSheetData<{ sprites: SheetSprite[] }> | null,
  ) => void
  onClearSelection?: () => void
  mode?: EditorMode
  onModeChange?: (mode: EditorMode) => void
}

// Tooltip component
const Tooltip: React.FC<{
  content: string
  children: React.ReactNode
}> = ({ content, children }) => {
  const [show, setShow] = useState(false)

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "6px 10px",
            background: "rgba(0, 0, 0, 0.9)",
            color: "white",
            fontSize: 11,
            fontWeight: 500,
            borderRadius: 4,
            whiteSpace: "nowrap",
            zIndex: 1000,
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {content}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid rgba(0, 0, 0, 0.9)",
            }}
          />
        </div>
      )}
    </div>
  )
}

// Sprite preview component
const SpritePreview: React.FC<{
  sprite: SheetSprite
  sheetData: SpriteSheetData<{ sprites: SheetSprite[] }>
}> = ({ sprite, sheetData }) => {
  const { meta } = sheetData
  const tileSize = meta.tileWidth ?? 16

  // Calculate pixel positions
  const bgX = sprite.region.x * tileSize
  const bgY = sprite.region.y * tileSize
  const width = sprite.region.width * tileSize
  const height = sprite.region.height * tileSize

  // Scale to fit in container (max 36px)
  const maxSize = 36
  const scale = Math.min(maxSize / width, maxSize / height, 1)

  return (
    <div
      style={{
        width: maxSize,
        height: maxSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.3)",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: width * scale,
          height: height * scale,
          backgroundImage: `url(/spritesheets/${meta.src})`,
          backgroundPosition: `-${bgX * scale}px -${bgY * scale}px`,
          backgroundSize: `${meta.width * scale}px ${meta.height * scale}px`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />
    </div>
  )
}

export const PlaceDock: React.FC<PlaceDockProps> = ({
  onPlaceItem,
  onClearSelection,
  mode,
  onModeChange,
}) => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeCategory, setActiveCategory] = useState("trees")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Listen for Esc key to clear selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null) // Just clear the focus
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Drag state
  const [position, setPosition] = useState({ x: 20, y: 100 })
  const dragRef = useRef<{
    isDragging: boolean
    startX: number
    startY: number
    startPosX: number
    startPosY: number
  } | null>(null)

  // Handle drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current?.isDragging) return

      const deltaX = e.clientX - dragRef.current.startX
      const deltaY = e.clientY - dragRef.current.startY

      setPosition({
        x: dragRef.current.startPosX + deltaX,
        y: dragRef.current.startPosY + deltaY,
      })
    }

    const handleMouseUp = () => {
      if (dragRef.current?.isDragging) {
        dragRef.current.isDragging = false
        document.body.style.cursor = ""
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    }
    document.body.style.cursor = "grabbing"
  }

  const currentCategory = ENTITY_CATEGORIES.find((c) => c.id === activeCategory)

  // Minimized state
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          padding: "8px 16px",
          fontSize: 12,
          background: "rgba(60, 60, 80, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: 6,
          color: "#fff",
          cursor: "pointer",
          zIndex: 600,
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          transition: "all 0.15s ease",
        }}
      >
        <span style={{ fontSize: 14 }}>🏠</span>
        <span>Show Entities</span>
        <span style={{ opacity: 0.5, fontSize: 10 }}>▶</span>
      </button>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: 300,
        maxHeight: "calc(100vh - 200px)",
        background: "rgba(20, 20, 30, 0.98)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        zIndex: 600,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      {/* Header - Draggable */}
      <div
        onMouseDown={handleDragStart}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          background: "rgba(60, 60, 80, 0.9)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          cursor: "grab",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🏠</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "white" }}>
            Place Entities
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, opacity: 0.4 }}>drag</span>
          <Tooltip content="Minimize">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(true)
              }}
              style={{
                width: 20,
                height: 20,
                padding: 0,
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 4,
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                transition: "all 0.15s ease",
              }}
            >
              ◀
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          padding: "8px 8px 0 8px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {ENTITY_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <Tooltip key={cat.id} content={cat.label}>
              <button
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  background: isActive
                    ? "rgba(100, 180, 255, 0.3)"
                    : "transparent",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid rgba(100, 180, 255, 0.9)"
                    : "2px solid transparent",
                  borderRadius: "4px 4px 0 0",
                  color: isActive ? "white" : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontSize: 14,
                  transition: "all 0.15s ease",
                }}
              >
                {cat.icon}
              </button>
            </Tooltip>
          )
        })}
      </div>

      {/* Items Grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: 8,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 6,
          alignContent: "start",
        }}
      >
        {currentCategory?.items.map((item) => {
          const isSelected = selectedItem === item.id
          return (
            <Tooltip key={item.id} content={`${item.name} (${item.size})`}>
              <div
                onClick={() => {
                  setSelectedItem(item.id)
                  // Auto-place when clicking
                  onPlaceItem?.(
                    item.id,
                    item.sprite,
                    item.sprite ? (currentCategory?.sheetData ?? null) : null,
                  )
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 4px",
                  height: 60,
                  width: "100%",
                  boxSizing: "border-box",
                  background: isSelected
                    ? "rgba(100, 180, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: isSelected
                    ? "2px solid rgba(100, 180, 255, 0.7)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.1)"
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.3)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.05)"
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.1)"
                  }
                }}
              >
                {/* Icon/Preview */}
                {item.sprite && currentCategory?.sheetData ? (
                  <SpritePreview
                    sprite={item.sprite}
                    sheetData={currentCategory.sheetData}
                  />
                ) : (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    {item.icon}
                  </div>
                )}

                {/* Name */}
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 4,
                    textAlign: "center",
                    lineHeight: 1.1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                  }}
                >
                  {item.name.length > 12
                    ? item.name.slice(0, 10) + "…"
                    : item.name}
                </div>
              </div>
            </Tooltip>
          )
        })}
      </div>

      {/* Footer hint */}
      <div
        style={{
          padding: "8px 12px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: 10,
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
        }}
      >
        Click to select, then click on map
      </div>
    </div>
  )
}
