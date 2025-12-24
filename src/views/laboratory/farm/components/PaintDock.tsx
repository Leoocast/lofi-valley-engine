/**
 * PaintDock - Floating paint toolbar component
 */

import React, { useEffect, useState } from "react"

import { EDITOR_MODES, type EditorMode } from "../farm_config"

import { PAINT_BRUSHES_DATA } from "@/engine/data/sprites/paintBrushes"

import {
  getTileOptionsForLayer,
  TILE_TYPE_TO_PREVIEW,
} from "../utils/paintUtils"

// Layer configuration
const LAYERS = [
  { value: 0, label: "Terrain", icon: "🌍", description: "Base terrain layer" },
  { value: 1, label: "Layer 1", icon: "🌱", description: "Ground details" },
  { value: 2, label: "Layer 2", icon: "⛰️", description: "Hills & elevation" },
  { value: 3, label: "Layer 3", icon: "🏔️", description: "Mountains & peaks" },
]

interface PaintDockProps {
  // Position & Drag
  position: { x: number; y: number }
  onDragStart: (e: React.MouseEvent) => void

  // Layer state
  activeLayer: number
  onLayerChange: (layer: number) => void

  // Tile selection
  selectedGroundTile: number
  onSelectTile: (tileType: number) => void

  // Brush size
  brushSize: number
  onBrushSizeChange: (size: number) => void

  // Mode
  mode: EditorMode
  onModeChange: (mode: EditorMode) => void
}

// Tooltip component with instant display
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
          {/* Arrow */}
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

export const PaintDock: React.FC<PaintDockProps> = ({
  position,
  onDragStart,
  activeLayer,
  onLayerChange,
  selectedGroundTile,
  onSelectTile,
  brushSize,
  onBrushSizeChange,
  mode,
  onModeChange,
}) => {
  const [isMinimized, setIsMinimized] = useState(false)

  // Listen for Esc key to clear selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSelectTile(-1) // Clear brush selection
        onModeChange(EDITOR_MODES.IDLE)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onSelectTile, onModeChange])

  const handleLayerClick = (layer: number) => {
    onLayerChange(layer)
    const options = getTileOptionsForLayer(layer)
    onSelectTile(options[0]?.value ?? -1)
  }

  const handleTileClick = (tileType: number) => {
    onSelectTile(tileType)
    if (mode !== EDITOR_MODES.PAINT) {
      onModeChange(EDITOR_MODES.PAINT)
    }
  }

  const handleEraserClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onSelectTile(-1)
    onModeChange(EDITOR_MODES.PAINT)
    ;(e.currentTarget as HTMLButtonElement).blur()
  }

  const isEraserActive =
    selectedGroundTile === -1 && mode === EDITOR_MODES.PAINT

  // Minimized state: show restore button
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        style={{
          position: "fixed",
          bottom: 15,
          left: "50%",
          transform: "translateX(-50%)",
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
        <span style={{ fontSize: 14 }}>🖌️</span>
        <span>Show Paint Tool</span>
        <span style={{ opacity: 0.5, fontSize: 10 }}>▲</span>
      </button>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        left: `calc(50% - 600px + ${position.x}px)`,
        bottom: 15 - position.y,
        width: 1200,
        background: "rgba(20, 20, 30, 0.98)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        zIndex: 600,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      {/* Draggable Header */}
      <div
        onMouseDown={onDragStart}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          background: "rgba(60, 60, 80, 0.9)",
          borderRadius: "8px 8px 0 0",
          cursor: "grab",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🖌️</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "white" }}>
            Paint Tool
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, opacity: 0.4 }}>drag to move</span>
          {/* Minimize Button */}
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
                lineHeight: 1,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
              }}
            >
              ▼
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Paint Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 12px",
          gap: 12,
        }}
      >
        {/* Layer Buttons */}
        <div style={{ display: "flex", gap: 4 }}>
          {LAYERS.map((layer) => {
            const isActive = activeLayer === layer.value
            return (
              <Tooltip key={layer.value} content={layer.description}>
                <button
                  onClick={() => handleLayerClick(layer.value)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    padding: 4,
                    background: isActive
                      ? "rgba(100, 180, 255, 0.4)"
                      : "rgba(255, 255, 255, 0.08)",
                    border: isActive
                      ? "2px solid rgba(100, 180, 255, 0.9)"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 6,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{layer.icon}</span>
                  <span
                    style={{
                      fontSize: 9,
                      color: isActive ? "white" : "rgba(255,255,255,0.6)",
                      marginTop: 2,
                    }}
                  >
                    {layer.value === 0 ? "Base" : `L${layer.value}`}
                  </span>
                </button>
              </Tooltip>
            )
          })}
        </div>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 32,
            background: "rgba(255,255,255,0.15)",
          }}
        />

        {/* Tile Icons Grid */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flex: 1 }}>
          {getTileOptionsForLayer(activeLayer)
            .filter((opt) => opt.value !== -1)
            .map((opt) => {
              const isSelected = selectedGroundTile === opt.value
              const previewId = TILE_TYPE_TO_PREVIEW[opt.value]
              const previewSprite = previewId
                ? PAINT_BRUSHES_DATA.sprites.find((s) => s.id === previewId)
                : null
              const bgX = previewSprite ? previewSprite.region.x * 16 : 0
              const bgY = previewSprite ? previewSprite.region.y * 16 : 0

              // Extract clean name from label (remove emoji)
              const tileName = opt.label.replace(/^[^\w]+/, "").trim()

              return (
                <Tooltip key={`${activeLayer}-${opt.value}`} content={tileName}>
                  <div
                    onClick={() => handleTileClick(opt.value)}
                    style={{
                      width: 48,
                      height: 48,
                      background: "transparent",
                      border: isSelected
                        ? "2px solid rgba(100, 180, 255, 0.9)"
                        : "2px solid transparent",
                      borderRadius: 4,
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    {previewSprite && (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: `-${bgX}px -${bgY}px`,
                          backgroundImage: `url(/spritesheets/${PAINT_BRUSHES_DATA.meta.src})`,
                          backgroundSize: `${PAINT_BRUSHES_DATA.meta.width}px ${PAINT_BRUSHES_DATA.meta.height}px`,
                          imageRendering: "pixelated",
                          transformOrigin: "top left",
                          transform: "scale(0.95)",
                        }}
                      />
                    )}
                  </div>
                </Tooltip>
              )
            })}
        </div>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 32,
            background: "rgba(255,255,255,0.15)",
          }}
        />

        {/* Brush Size - Visual Grid */}
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 3, 5].map((size) => {
            const gridSize = size === 1 ? 1 : size === 3 ? 3 : 5
            const dotSize = size === 1 ? 8 : size === 3 ? 4 : 3
            const isActive = brushSize === size
            return (
              <Tooltip key={size} content={`${size}×${size} brush`}>
                <button
                  onClick={() => onBrushSizeChange(size)}
                  style={{
                    width: 32,
                    height: 32,
                    background: isActive
                      ? "rgba(100, 180, 255, 0.4)"
                      : "rgba(255, 255, 255, 0.08)",
                    border: isActive
                      ? "2px solid rgba(100, 180, 255, 0.9)"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 4,
                    cursor: "pointer",
                    display: "grid",
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gap: 1,
                    padding: 4,
                    placeItems: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: "50%",
                        background: isActive ? "#7ac4ff" : "#888",
                      }}
                    />
                  ))}
                </button>
              </Tooltip>
            )
          })}
        </div>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 32,
            background: "rgba(255,255,255,0.15)",
          }}
        />

        {/* Eraser */}
        <Tooltip content="Eraser">
          <button
            tabIndex={-1}
            onClick={handleEraserClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              background: isEraserActive
                ? "rgba(255, 100, 100, 0.4)"
                : "rgba(255, 255, 255, 0.08)",
              border: isEraserActive
                ? "2px solid rgba(255, 100, 100, 0.9)"
                : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 4,
              color: "white",
              fontSize: 12,
              cursor: "pointer",
              outline: "none",
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: 16 }}>🧹</span>
            <span>Erase</span>
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
