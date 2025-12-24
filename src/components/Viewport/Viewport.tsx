import React from "react"

/* eslint-disable react/require-default-props */

import type { ViewportState } from "@/hooks/useViewport"

interface ViewportProps {
  viewport: ViewportState
  children: React.ReactNode
  cursor?: string
  farmHeight: number
  farmWidth: number
  onMouseDown?: (e: React.MouseEvent) => void
  onMouseLeave?: () => void
  onMouseMove?: (e: React.MouseEvent) => void
  onClick?: (e: React.MouseEvent) => void
  onMouseUp?: (e: React.MouseEvent) => void
  onWheel?: (e: React.WheelEvent) => void
  timeOfDay?: "morning" | "day" | "evening" | "night"
}

/**
 * Viewport Component
 *
 * Encapsulates all viewport rendering logic:
 * - Creates and manages worldRef
 * - Applies zoom and pan transforms
 * - Handles viewport styling and filters
 * - Wraps children (grid, entities, weather, etc.)
 *
 * This is the main container for the game world.
 * Used by Farm and can be reused for Mine, Beach, Town, etc.
 */
export const Viewport = React.forwardRef<HTMLDivElement, ViewportProps>(
  (
    {
      cursor = "default",
      farmHeight,
      farmWidth,
      onClick,
      onMouseDown,
      onMouseLeave,
      onMouseMove,
      onMouseUp,
      onWheel,
      timeOfDay = "day",
      children,
      viewport,
    },
    _ref,
  ) => {
    // Store worldRef in viewport hook (it's already created there)
    // We just use it here for rendering

    const TILE_SIZE = 16 // From config

    return (
      <div
        ref={viewport.viewportRef}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onWheel={onWheel}
        role="presentation"
        style={{
          // border: "1px solid white",
          cursor,
          height: "calc(100vh)",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        {/* WORLD ROOT */}
        <div
          ref={viewport.worldRef}
          style={{
            position: "absolute",
            transform: `translate(${viewport.offset.x}px, ${viewport.offset.y}px) scale(${viewport.zoom})`,
            transformOrigin: "top left",
            width: farmWidth * TILE_SIZE,
            height: farmHeight * TILE_SIZE,
            filter:
              timeOfDay === "morning"
                ? "sepia(0.15) hue-rotate(10deg) brightness(1.05) saturate(1.1)"
                : timeOfDay === "day"
                  ? "brightness(1) saturate(1)"
                  : timeOfDay === "evening"
                    ? "sepia(0.3) hue-rotate(-10deg) brightness(0.85) saturate(1.2)"
                    : "brightness(0.25) hue-rotate(32deg) sepia(0.1)",
            transition: "filter 2s ease-in-out",
          }}
        >
          {children}
        </div>
      </div>
    )
  },
)

Viewport.displayName = "Viewport"
