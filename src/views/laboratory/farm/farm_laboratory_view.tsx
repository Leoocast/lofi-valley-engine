/* eslint-disable react/jsx-no-bind */
/* eslint-disable import-x/order */

import { useNavigate } from "@tanstack/react-router"
import React, { ReactElement, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useStore } from "zustand"

import { helpActions, helpStore } from "@/engine/helpStore"

import type { SheetSprite } from "@/engine/data/sprites/winterSprites"
import type { SpriteSheetData } from "@/engine/data/spritesheetData"
import type { EditorMode } from "./farm_config"
import styles from "./farm_laboratory_view.module.scss"

import { Entities } from "@/components/Entities/Entities"
import { EntityContextPopup } from "@/components/Entities/EntityContextPopup"
import { Grid } from "@/components/Grid/Grid"
import { Minimap } from "@/components/Minimap/Minimap"
import { Viewport } from "@/components/Viewport/Viewport"
import { Weather } from "@/components/Weather/Weather"
import { useGroundTilesStore } from "@/engine/groundTilesStore"
import type { Entity } from "@/engine/interfaces/entity"
import { TILE_SIZE } from "@/engine/rendering/config"
import { getCollisionSize } from "@/engine/rendering/sheetSpriteUtils"
import { worldActions } from "@/engine/store"
import { useEntitySelection } from "@/hooks/useEntitySelection"
import { useFarmAutoLoad } from "@/hooks/useFarmAutoLoad"
import { usePaintMode } from "@/hooks/usePaintMode"
import { usePlaceMode } from "@/hooks/usePlaceMode"
import { useShortcuts } from "@/hooks/useShortcuts"
import { useTimeOfDay } from "@/hooks/useTimeOfDay"
import { useViewport } from "@/hooks/useViewport"
import { useWeather } from "@/hooks/useWeather"

import {
  CURSOR_MAP,
  EDITOR_MODES,
  FARM_HEIGHT,
  FARM_WIDTH,
} from "./farm_config"

import { generateFarmId } from "@/services/farmStorage"
import {
  FarmManager,
  LaboratoryWelcome,
  LabToolbar,
  PaintDock,
  PlaceDock,
  WaterBackground,
} from "./components"

export const FarmLaboratory = (): ReactElement => {
  const navigate = useNavigate()
  const { t } = useTranslation("laboratory")

  // ======== PAUSE TIME ON MOUNT ========
  useEffect(() => {
    // Pause time when entering laboratory
    worldActions.pause()

    // Resume time when leaving
    return () => {
      worldActions.resume()
    }
  }, [])

  // ======== PAINT DOCK DRAG ========
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!paintDockDragRef.current.isDragging) return
      const dx = e.clientX - paintDockDragRef.current.startX
      const dy = e.clientY - paintDockDragRef.current.startY
      setPaintDockPos({
        x: paintDockDragRef.current.startPosX + dx,
        y: paintDockDragRef.current.startPosY + dy,
      })
    }
    const handleMouseUp = () => {
      paintDockDragRef.current.isDragging = false
      document.body.style.cursor = ""
    }
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  // ======== GRID DIMENSIONS (must be before useViewport) ========
  const [gridWidth, setGridWidth] = useState(FARM_WIDTH)
  const [gridHeight, setGridHeight] = useState(FARM_HEIGHT)

  // ======== VIEWPORT - Use hook ========
  const viewport = useViewport(gridWidth, gridHeight)

  // ======== WORLD STATE ========
  const [entities, setEntities] = useState<Entity[]>([])
  const groundTiles = useGroundTilesStore((s) => s.groundTiles)
  const setGroundTiles = useGroundTilesStore((s) => s.setGroundTiles)
  const updateGroundTiles = useGroundTilesStore((s) => s.updateGroundTiles)

  // ======== EDITOR STATE ========
  const [mode, setMode] = useState<EditorMode>(EDITOR_MODES.IDLE)
  const [mouseTile, setMouseTile] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [showGrid, setShowGrid] = useState(true)
  const [hideWater, setHideWater] = useState(true)
  const [hideUI, setHideUI] = useState(false)

  // ======== FARM MANAGER STATE ========
  const [farmId, setFarmId] = useState<string | null>(null)
  const [farmName, setFarmName] = useState("Untitled Farm")
  const [showFarmManager, setShowFarmManager] = useState(false)

  // ======== FARM AUTO-LOAD ========
  useFarmAutoLoad({
    setFarmId,
    setFarmName,
    setEntities,
    setGridWidth,
    setGridHeight,
  })

  // ======== WELCOME MODAL - Show once or when help clicked ========
  const isHelpOpen = useStore(helpStore, (s) => s.isHelpOpen)
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = localStorage.getItem("lofi-valley-lab-welcome-seen")
    return !hasSeenWelcome
  })

  // Listen for help button clicks
  useEffect(() => {
    if (isHelpOpen) {
      setShowWelcome(true)
      helpActions.close()
    }
  }, [isHelpOpen])

  const handleCloseWelcome = () => {
    localStorage.setItem("lofi-valley-lab-welcome-seen", "true")
    setShowWelcome(false)
  }

  // SheetSprite placement state (for placing from PlaceDock)
  const [selectedSheetSprite, setSelectedSheetSprite] = useState<{
    sprite: SheetSprite
    sheetData: SpriteSheetData<{ sprites: SheetSprite[] }>
  } | null>(null)

  // Paint dock floating toolbar state
  const [paintDockPos, setPaintDockPos] = useState({ x: 0, y: 0 })
  const paintDockDragRef = React.useRef<{
    isDragging: boolean
    startX: number
    startY: number
    startPosX: number
    startPosY: number
  }>({ isDragging: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 })

  // ======== PAINT MODE ========
  const {
    activeLayer,
    brushSize,
    handleMouseDown: handlePaintMouseDown,
    handleMouseLeave: handlePaintMouseLeave,
    handleMouseUp: handlePaintMouseUp,
    isPainting,
    paintTile,
    selectedGroundTile,
    setActiveLayer,
    setBrushSize,
    setSelectedGroundTile,
  } = usePaintMode({
    farmHeight: gridHeight,
    farmWidth: gridWidth,
    mode,
    mouseTile,
    onPaint: updateGroundTiles,
    viewport,
  })

  // ======== TIME & WEATHER ========
  const { timeOfDay, setTimeOfDay } = useTimeOfDay()
  const { weather, setWeather } = useWeather()

  // ======== PLACE MODE ========
  const {
    canPlaceAt,
    hoveredEntity,
    placingDef,
    selectedItemType,
    selectedSprite,
    setHoveredEntity,
    setSelectedItemType,
    setSelectedSprite,
  } = usePlaceMode({
    entities,
    farmHeight: gridHeight,
    farmWidth: gridWidth,
  })

  // ======== NEW UNIFIED SELECTION (IDLE mode) ========
  const entitySelection = useEntitySelection({
    entities,
    canPlaceAt,
    onMoveEntity: (idx, newX, newY) => {
      setEntities((prev) =>
        prev.map((e, i) => (i === idx ? { ...e, x: newX, y: newY } : e)),
      )
    },
    onDeleteEntity: (idx) => {
      setEntities((prev) => prev.filter((_, i) => i !== idx))
    },
  })

  // ======== SHEETSPRITE COLLISION CHECK ========
  const canPlaceSheetSprite = React.useCallback(
    (tx: number, ty: number, sprite: SheetSprite): boolean => {
      const { w, h } = getCollisionSize(sprite)
      const offsetX = sprite.collision?.offsetX ?? 0

      // Check bounds
      if (
        tx + offsetX < 0 ||
        ty < 0 ||
        tx + offsetX + w > gridWidth ||
        ty + h > gridHeight
      ) {
        return false
      }

      // Check collision with existing entities
      for (const ent of entities) {
        // Check if entity is SheetSprite or old Sprite
        const entSheet = (ent as Entity & { sheetSprite?: SheetSprite })
          .sheetSprite
        const entSize = entSheet
          ? getCollisionSize(entSheet)
          : { w: ent.sprite.baseWidth, h: ent.sprite.baseHeight }
        const entOffsetX =
          entSheet?.collision?.offsetX ?? ent.sprite.baseOffsetX ?? 0

        for (let ey = 0; ey < entSize.h; ey++) {
          for (let ex = 0; ex < entSize.w; ex++) {
            for (let ny = 0; ny < h; ny++) {
              for (let nx = 0; nx < w; nx++) {
                if (
                  ent.x + entOffsetX + ex === tx + offsetX + nx &&
                  ent.y + ey === ty + ny
                ) {
                  return false
                }
              }
            }
          }
        }
      }
      return true
    },
    [entities],
  )

  // ======================================================
  // KEYBOARD SHORTCUTS
  // ======================================================

  useShortcuts(
    {
      escape: () => {
        setMode(EDITOR_MODES.IDLE)
        setHoveredEntity(null)
        setSelectedSheetSprite(null)
        setSelectedGroundTile(-1)
        handlePaintMouseLeave()
        // Remove focus from any button
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      },
      p: () => {
        setMode(EDITOR_MODES.PLACE)
        handlePaintMouseLeave()
      },
      b: () => {
        setMode(EDITOR_MODES.PAINT)
        setHoveredEntity(null)
      },
      g: () => {
        setShowGrid((prev) => !prev)
      },
      o: () => {
        setHideWater((prev) => !prev)
      },
      h: () => {
        setHideUI((prev) => !prev)
      },
    },
    [mode],
  )

  // ======================================================
  // ZOOM
  // ======================================================

  /**
   * handleWheel: Maneja el zoom con la rueda del mouse.
   *
   * Implementa "zoom hacia el cursor" manteniendo el punto del mundo
   * bajo el mouse en la misma posición de pantalla después del zoom.
   *
   * Delegado al hook viewport para centralizar la lógica de zoom.
   */
  function handleWheel(e: React.WheelEvent) {
    viewport.handleWheel(e as unknown as React.WheelEvent)
  }

  // ======================================================
  // PANNING
  // ======================================================

  function handleMouseDown(e: React.MouseEvent) {
    // Delegate camera drag to viewport hook (middle button)
    if (e.button === 1) {
      viewport.handleMouseDown(e)
    }

    // Paint mode handler
    handlePaintMouseDown(e)

    // IDLE mode: start entity selection drag tracking
    if (mode === EDITOR_MODES.IDLE) {
      entitySelection.handleMouseDown({ x: e.clientX, y: e.clientY })
    }
  }

  function handleMouseUp(e: React.MouseEvent) {
    // Delegate camera drag end to viewport hook
    if (e.button === 1) {
      viewport.handleMouseUp(e)
    }

    // Paint mode handler
    handlePaintMouseUp(e)

    // IDLE mode: finish entity selection (drop or select)
    if (mode === EDITOR_MODES.IDLE && mouseTile) {
      entitySelection.handleMouseUp(mouseTile)
    }
  }

  function handleMouseLeave() {
    viewport.handleMouseLeave()
    handlePaintMouseLeave()
  }

  // ======================================================
  // MOUSE MOVE: cámara, tile actual y hover
  // ======================================================

  function handleMouseMove(e: React.MouseEvent) {
    // Delegate camera drag movement to viewport hook
    viewport.handleMouseMove(e)

    if (!viewport.worldRef.current) return

    const rect = viewport.worldRef.current.getBoundingClientRect()
    const localX = (e.clientX - rect.left) / viewport.zoom
    const localY = (e.clientY - rect.top) / viewport.zoom

    const tileX = Math.floor(localX / TILE_SIZE)
    const tileY = Math.floor(localY / TILE_SIZE)

    if (tileX >= 0 && tileX < gridWidth && tileY >= 0 && tileY < gridHeight)
      setMouseTile({ x: tileX, y: tileY })
    else setMouseTile(null)

    // Pintar tiles con autotiling mientras se arrastra en paint mode
    if (mode === EDITOR_MODES.PAINT && isPainting && mouseTile) {
      updateGroundTiles((prev) => paintTile(prev, mouseTile))
    }

    // IDLE mode: Track entity hover and drag
    if (mode === EDITOR_MODES.IDLE) {
      entitySelection.handleMouseMove(
        { x: tileX, y: tileY },
        { x: e.clientX, y: e.clientY },
      )
    }
  }

  // ======================================================
  // CLICK EN EL MUNDO - Maneja diferentes acciones según el modo
  // ======================================================

  /**
   * handleWorldClick: Procesa clicks según el modo actual:
   *
   * PLACE: Coloca nueva entidad si no hay colisión
   * PAINT/IDLE: Manejado por otros sistemas
   */
  function handleWorldClick(e: React.MouseEvent) {
    if (e.button !== 0) return
    if (!mouseTile) return

    // Only handle PLACE mode - other modes are handled by useEntitySelection or usePaintMode
    if (mode === EDITOR_MODES.PLACE) {
      // New SheetSprite placement
      if (selectedSheetSprite) {
        const { sprite, sheetData } = selectedSheetSprite
        const can = canPlaceSheetSprite(mouseTile.x, mouseTile.y, sprite)
        if (!can) return

        setEntities((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            x: mouseTile.x,
            y: mouseTile.y,
            spriteIndex: 0,
            sprite: placingDef,
            sheetSprite: sprite,
            sheetSrc: sheetData.meta.src,
          } as Entity & { sheetSprite: typeof sprite; sheetSrc: string },
        ])
        return
      }

      // Old Sprite placement (fallback)
      const can = canPlaceAt(mouseTile.x, mouseTile.y, { sprite: placingDef })
      if (!can) return

      setEntities((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          x: mouseTile.x,
          y: mouseTile.y,
          width: placingDef.baseWidth,
          height: placingDef.baseHeight,
          spriteIndex: selectedSprite,
          sprite: placingDef,
        },
      ])
    }
  }

  // ======================================================
  // RENDER
  // ======================================================

  // Map laboratory timeOfDay to Viewport timeOfDay
  const viewportTimeOfDay: "morning" | "day" | "evening" | "night" =
    timeOfDay === "afternoon" ? "evening" : timeOfDay

  return (
    <div
      className={styles.laboratoryContainer}
      style={{
        cursor:
          mode === EDITOR_MODES.IDLE && entitySelection.isDragging
            ? "grabbing"
            : undefined,
      }}
    >
      {/* FLOATING CONTROLS - Fixed top-right */}
      {!hideUI && (
        <LabToolbar
          timeOfDay={timeOfDay}
          onTimeChange={setTimeOfDay}
          weather={weather}
          onWeatherChange={setWeather}
          hideWater={hideWater}
          onHideWaterChange={setHideWater}
          showGrid={showGrid}
          onShowGridChange={setShowGrid}
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          onGridSizeChange={(newWidth, newHeight) => {
            // Clear all data when changing size
            setGroundTiles(new Map())
            setEntities([])
            setFarmId(null)
            setFarmName("Untitled Farm")
            setGridWidth(newWidth)
            setGridHeight(newHeight)
          }}
          onReset={() => {
            setGroundTiles(new Map())
            setEntities([])
            setFarmId(null)
            setFarmName("Untitled Farm")
          }}
          onOpenFarmManager={() => setShowFarmManager(true)}
        />
      )}

      {/* VIEWPORT CONTAINER WITH WEATHER OVERLAY - key forces remount when dimensions change */}
      <div
        key={`viewport-${gridWidth}-${gridHeight}`}
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* VIEWPORT */}
        <Viewport
          cursor={
            viewport.isDragging ||
            (mode === EDITOR_MODES.IDLE && entitySelection.isDragging)
              ? "grabbing"
              : CURSOR_MAP[mode]
          }
          farmHeight={gridHeight}
          farmWidth={gridWidth}
          onClick={handleWorldClick}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          timeOfDay={viewportTimeOfDay}
          viewport={viewport}
        >
          {/* WATER BACKGROUND */}
          <WaterBackground
            width={gridWidth}
            height={gridHeight}
            hideWater={hideWater}
          />

          {/* GRID */}
          <Grid
            brushSize={brushSize}
            groundTiles={groundTiles}
            height={gridHeight}
            mode={mode}
            mouseTile={mouseTile}
            selectedGroundTile={selectedGroundTile}
            showGrid={showGrid}
            width={gridWidth}
          />

          {/* ENTITIES */}
          <Entities
            brushSize={brushSize}
            canPlaceAt={canPlaceAt}
            entities={entities}
            hoveredEntity={hoveredEntity}
            mode={mode}
            mouseTile={mouseTile}
            placingDef={placingDef}
            selectedGroundTile={selectedGroundTile}
            selectedSprite={selectedSprite}
            timeOfDay={timeOfDay}
            selectedSheetSprite={selectedSheetSprite}
            canPlaceSheetSprite={canPlaceSheetSprite}
            // New unified selection (IDLE mode)
            selectionHoveredIdx={
              mode === EDITOR_MODES.IDLE
                ? entitySelection.hoveredEntityIndex
                : null
            }
            selectionSelectedIdx={
              mode === EDITOR_MODES.IDLE
                ? entitySelection.selectedEntityIndex
                : null
            }
            selectionIsDragging={entitySelection.isDragging}
            selectionDraggingIdx={entitySelection.draggingEntityIndex}
            selectionPreviewPos={entitySelection.previewPosition}
            selectionCanDrop={entitySelection.canDropAtPreview}
          />

          {/* ENTITY CONTEXT POPUP (IDLE mode) */}
          {mode === EDITOR_MODES.IDLE &&
            entitySelection.selectedEntityIndex !== null &&
            !entitySelection.isDragging &&
            (() => {
              const selectedEntity =
                entities[entitySelection.selectedEntityIndex]
              if (!selectedEntity) return null
              const sheet = (
                selectedEntity as Entity & { sheetSprite?: SheetSprite }
              ).sheetSprite
              const size = sheet
                ? getCollisionSize(sheet)
                : {
                    w: selectedEntity.sprite.baseWidth,
                    h: selectedEntity.sprite.baseHeight,
                  }
              return (
                <EntityContextPopup
                  entityX={selectedEntity.x}
                  entityY={selectedEntity.y}
                  entityWidth={size.w}
                  entityHeight={size.h}
                  onStartDrag={entitySelection.startDragFromSelection}
                  onDelete={entitySelection.handleDeleteSelected}
                />
              )
            })()}
        </Viewport>

        {/* WEATHER LAYER - Overlay for immersion */}
        <Weather weather={weather} />
      </div>

      {/* MINIMAP */}
      {!hideUI && (
        <Minimap
          entities={entities}
          groundTiles={groundTiles}
          minimap={viewport.minimap}
          viewport={{
            viewportRef: viewport.viewportRef,
            offset: viewport.offset,
            zoom: viewport.zoom,
          }}
        />
      )}

      {/* DEBUG INFO */}
      {/* <DebugInfo>
        <div style={{ display: "flex", gap: "20px" }}>
          <span>Zoom: {viewport.zoom.toFixed(2)}</span>
          <span>Offset X: {viewport.offset.x.toFixed(1)}</span>
          <span>Offset Y: {viewport.offset.y.toFixed(1)}</span>
          <span style={{ color: "#d49837" }}>Entities: {entities.length}</span>
          <span style={{ color: "#88dd88" }}>Tiles: {groundTiles.size}</span>
        </div>
        <span style={{ opacity: 0.7, fontSize: "11px" }}>
          Hotkeys: P=Place · M=Move · X=Delete · B=Brush · G=Grid · ESC=Cancel
        </span>
      </DebugInfo> */}

      {/* FLOATING PAINT DOCK */}
      {!hideUI && (
        <PaintDock
          position={paintDockPos}
          onDragStart={(e) => {
            e.preventDefault()
            paintDockDragRef.current = {
              isDragging: true,
              startX: e.clientX,
              startY: e.clientY,
              startPosX: paintDockPos.x,
              startPosY: paintDockPos.y,
            }
            document.body.style.cursor = "grabbing"
          }}
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
          selectedGroundTile={selectedGroundTile}
          onSelectTile={setSelectedGroundTile}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          mode={mode}
          onModeChange={setMode}
        />
      )}

      {/* FLOATING PLACE DOCK */}
      {!hideUI && (
        <PlaceDock
          onPlaceItem={(itemId, sprite, sheetData) => {
            if (sprite && sheetData) {
              setSelectedSheetSprite({ sprite, sheetData })
              setMode(EDITOR_MODES.PLACE)
            }
          }}
          onClearSelection={() => {
            // Clear selections when Esc is pressed (like eraser button does)
            setSelectedSheetSprite(null)
            setSelectedGroundTile(-1) // Clear paint brush selection
          }}
          mode={mode}
          onModeChange={setMode}
        />
      )}
      {/* FARM MANAGER MODAL */}
      <FarmManager
        isOpen={showFarmManager}
        onClose={() => setShowFarmManager(false)}
        currentFarmId={farmId}
        currentFarmName={farmName}
        groundTiles={groundTiles}
        entities={entities}
        farmWidth={gridWidth}
        farmHeight={gridHeight}
        onLoadFarm={(id, name, tiles, ents, width, height) => {
          // Set dimensions first to ensure viewport is ready
          setGridWidth(width)
          setGridHeight(height)
          // Then set data
          setFarmId(id)
          setFarmName(name)
          setGroundTiles(tiles)
          setEntities(ents)
        }}
        onNewFarm={() => {
          setFarmId(generateFarmId())
          setFarmName("Untitled Farm")
          setGroundTiles(new Map())
          setEntities([])
        }}
        onFarmNameChange={setFarmName}
      />

      {/* WELCOME MODAL - First time only */}
      <LaboratoryWelcome isOpen={showWelcome} onClose={handleCloseWelcome} />
    </div>
  )
}
