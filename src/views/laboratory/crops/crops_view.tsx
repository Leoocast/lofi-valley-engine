import type { ReactElement } from "react"
import { useEffect, useState } from "react"
import { useStore } from "zustand"

import { CurrentHotbar } from "@/components/CurrentHotbar/CurrentHotbar"
import { GameEntities } from "@/components/GameEntities/GameEntities"
import { Grid } from "@/components/Grid/Grid"
import { Inventory } from "@/components/Inventory/Inventory"
import { Minimap } from "@/components/Minimap/Minimap"

import { ToolHoverOverlay } from "@/components/ToolHoverOverlay/ToolHoverOverlay"
import { Viewport } from "@/components/Viewport/Viewport"
import { WaterBackground } from "@/components/WaterBackground/WaterBackground"
import { ITEM_DEFINITIONS } from "@/constants/items"
import { TOOLS } from "@/constants/tools"
import { helpActions, helpStore } from "@/engine/helpStore"
import { hotbarActions } from "@/engine/hotbarStore"
import { inventoryActions } from "@/engine/inventoryStore"
import { getItemSpriteStyle } from "@/engine/rendering/cropRenderer"
import { worldActions } from "@/engine/store"
import { toolsStore } from "@/engine/toolsStore"
import { useCropsGroundTilesStore } from "./stores/cropsGroundTilesStore"

import { useHotbar } from "@/hooks/useHotbar"
import { useMouseTilePosition } from "@/hooks/useMouseTilePosition"
import { useShortcuts } from "@/hooks/useShortcuts"
import { useViewport } from "@/hooks/useViewport"
import { useWorld } from "@/hooks/useWorld"
import { findEntityAtTile } from "@/utils/findEntityAtTile"
import { loadMapDataSync } from "@/utils/loadMapData"

import { DecorationMenu } from "@/components/DecorationMenu/DecorationMenu"
import { DroppedItems } from "@/components/DroppedItems/DroppedItems"
import { SeedCursorGhost } from "@/components/SeedCursorGhost/SeedCursorGhost"
import type { CropEntity } from "@/engine/interfaces/crops"
import { handleToolUse } from "@/engine/tools/toolRouter"
import { CropsWelcome } from "./components/CropsWelcome"
import { FARM_HEIGHT, FARM_WIDTH } from "./crops_farm_config"

// Import map data
import { CropTooltip } from "@/components/CropTooltip/CropTooltip"
import Map1Data from "@/engine/data/maps/map_1.json"

/**
 * Vista principal de la granja en modo juego.
 * Muestra el grid básico con controles de cámara y overlay de tiempo.
 */
export const CropsFarmView = (): ReactElement => {
  // ======== VIEWPORT - Controles de cámara ========
  const viewport = useViewport(FARM_WIDTH, FARM_HEIGHT)

  // ======== MOUSE TILE TRACKING - Para hover de herramientas ========
  const { mouseTile, handleMouseMove: handleToolHover } = useMouseTilePosition(
    viewport.worldRef,
    viewport.zoom,
    FARM_WIDTH,
    FARM_HEIGHT,
  )

  // ======== ESTADO DEL GRID ========
  const [showGrid, setShowGrid] = useState(false)

  // ======== GROUND TILES - Terrain system (crops-specific store) ========
  const groundTiles = useCropsGroundTilesStore((s) => s.groundTiles)

  // ======== WELCOME MODAL - Show once or when help clicked ========
  const isHelpOpen = useStore(helpStore, (s) => s.isHelpOpen)
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = localStorage.getItem(
      "lofi-valley-crops-welcome-seen",
    )
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
    localStorage.setItem("lofi-valley-crops-welcome-seen", "true")
    setShowWelcome(false)
  }

  // ======== TIEMPO DEL JUEGO desde el motor ========
  const hour = useWorld((s) => s.gameTime.hour)
  const activeTool = useWorld((s) => s.activeTool)
  const entities = useWorld((s) => s.entities)
  const tilledSoil = useWorld((s) => s.tilledSoil)

  // ======== HOTBAR SYSTEM ========
  const activeHotbar = useHotbar((s) => s.activeHotbar)
  const activeSlotIndex = useHotbar((s) => s.activeSlotIndex)
  const activeSlot = hotbarActions.getActiveSlot()

  // Inicializar mapa desde JSON (solo una vez)
  useEffect(() => {
    const current = useCropsGroundTilesStore.getState().groundTiles
    if (current.size === 0) {
      // Cargar Map_1 si no hay tiles cargados
      const tiles = loadMapDataSync(Map1Data as any)
      useCropsGroundTilesStore.getState().setGroundTiles(tiles)
    }
  }, [])

  // Inicializar MainHotbar con tools (solo una vez)
  useEffect(() => {
    const toolOrder = toolsStore.getState().toolHotbarOrder
    hotbarActions.initializeMainHotbar(toolOrder)
  }, [])

  // Sincronizar tool activa con worldStore
  useEffect(() => {
    const itemId = activeSlot?.itemId
    if (!itemId) {
      worldActions.clearTool()
      return
    }

    // Verificar si es una herramienta
    const isTool = TOOLS.some((t) => t.id === itemId)
    if (isTool) {
      worldActions.setActiveTool(itemId as any)
    } else {
      worldActions.clearTool()
    }
  }, [activeSlot?.itemId])

  // Track mouse drag globally for drop-to-remove
  const mouseDrag = useHotbar((state) => state.mouseDrag)

  useEffect(() => {
    if (!mouseDrag) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      hotbarActions.updateMouseDrag(e.clientX, e.clientY)
    }

    const handleGlobalMouseUp = () => {
      if (mouseDrag && mouseDrag.isDragging && !mouseDrag.dropHandled) {
        // Only clear hotbar slot if dragging from a hotbar (not inventory)
        //  AND the drop was not handled by a valid target
        if (
          mouseDrag.source === "main" ||
          mouseDrag.source === "custom1" ||
          mouseDrag.source === "custom2"
        ) {
          // Drop to remove - clear the hotbar slot
          hotbarActions.clearHotbarSlot(mouseDrag.source, mouseDrag.sourceIndex)
        }
      }
      hotbarActions.endMouseDrag()
    }

    window.addEventListener("mousemove", handleGlobalMouseMove)
    window.addEventListener("mouseup", handleGlobalMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [mouseDrag])

  // ======== HOVER STATE - Entidad bajo el mouse ========
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null)
  const [hoveredCrop, setHoveredCrop] = useState<CropEntity | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Calcular el time of day basado en la hora
  const getTimeOfDay = (): "morning" | "day" | "evening" | "night" => {
    if (hour >= 6 && hour < 12) return "morning"
    if (hour >= 12 && hour < 18) return "day"
    if (hour >= 18 && hour < 21) return "evening"
    return "night"
  }

  const timeOfDay = getTimeOfDay()

  // ======================================================
  // ZOOM
  // ======================================================
  function handleWheel(e: React.WheelEvent) {
    viewport.handleWheel(e as unknown as React.WheelEvent)
  }

  // ======================================================
  // PANNING (Arrastrar cámara con mouse)
  // ======================================================
  function handleMouseDown(e: React.MouseEvent) {
    if (e.button === 1) {
      // Middle button
      viewport.handleMouseDown(e)
    }
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (e.button === 1) {
      viewport.handleMouseUp(e)
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    viewport.handleMouseMove(e) // Camera panning
    handleToolHover(e) // Tool hover tracking
    setMousePos({ x: e.clientX, y: e.clientY })

    // Detectar entidad bajo el mouse para hover effect
    if (mouseTile) {
      const entity = findEntityAtTile(mouseTile, entities)
      setHoveredEntity(entity?.id || null)

      // Detectar crop para tooltip (solo si ESC o scythe activa)
      const crop = entities.find(
        (ent) =>
          ent.type === "crop" && ent.x === mouseTile.x && ent.y === mouseTile.y,
      ) as CropEntity | undefined

      // Show tooltip only when: no tool AND no seed, or scythe active
      const showTooltip =
        (!activeTool && !activeSlot?.itemId) || activeTool === "scythe"
      setHoveredCrop(showTooltip && crop ? crop : null)
    } else {
      setHoveredCrop(null)
    }
  }

  function handleMouseLeave() {
    viewport.handleMouseLeave()
    setHoveredEntity(null)
  }

  // ======================================================
  // TOOL USAGE - Click para usar herramienta
  // ======================================================
  function handleToolClick(e: React.MouseEvent) {
    if (e.button !== 0) return // Solo click izquierdo
    if (!mouseTile) return

    // Extraer item y cantidad del slot activo
    const itemDef = activeSlot?.itemId
      ? inventoryActions.getItemDefinition(activeSlot.itemId)
      : null

    const itemQuantity = activeSlot?.itemId
      ? (inventoryActions.getItem(activeSlot.itemId)?.quantity ?? 0)
      : 0

    handleToolUse({
      mouseTile,
      activeTool,
      activeItem: itemDef ?? null,
      activeItemQuantity: itemQuantity,
      entities,
      tilledSoil,
      FARM_WIDTH,
      FARM_HEIGHT,
      groundTiles: useCropsGroundTilesStore.getState().groundTiles,
      setGroundTiles: useCropsGroundTilesStore.getState().setGroundTiles,
    })
  }

  // ======================================================
  // KEYBOARD SHORTCUTS - Hotbar system
  // ======================================================
  useShortcuts(
    {
      // Cycle hotbar (Q)
      q: () => hotbarActions.cycleHotbar(),

      // Slots 1-0 (context-aware)
      "1": () => hotbarActions.selectSlot(0),
      "2": () => hotbarActions.selectSlot(1),

      "3": () => hotbarActions.selectSlot(2),
      "4": () => hotbarActions.selectSlot(3),
      "5": () => hotbarActions.selectSlot(4),
      "6": () => hotbarActions.selectSlot(5),
      "7": () => hotbarActions.selectSlot(6),

      "8": () => hotbarActions.selectSlot(7),
      "9": () => hotbarActions.selectSlot(8),
      "0": () => hotbarActions.selectSlot(9),

      // Toggle inventario
      i: () => inventoryActions.toggleInventory(),

      // Toggle decoration menu (F)
      f: () => hotbarActions.toggleDecorationMenu(),

      // Toggle grid (G)
      g: () => setShowGrid((prev) => !prev),

      // Cancel (ESC) - Deselect and close menus
      escape: () => {
        // Deselect current slot (select -1 to deselect)
        hotbarActions.selectSlot(-1)
        // Clear tool
        worldActions.clearTool()
        // Close menus
        hotbarActions.setDecorationMode(null)
        inventoryActions.closeInventory()
      },
    },
    [],
  )

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="flex h-screen w-full flex-col select-none overflow-hidden bg-black text-white">
      {/* VIEWPORT CONTAINER - Ocupa todo el espacio disponible */}
      <div className="relative flex-1 overflow-hidden">
        <div
          style={{ position: "relative", overflow: "hidden", height: "100%" }}
        >
          <Viewport
            cursor={viewport.isDragging ? "grabbing" : "default"}
            farmHeight={FARM_HEIGHT}
            farmWidth={FARM_WIDTH}
            onClick={handleToolClick}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            timeOfDay={timeOfDay}
            viewport={viewport}
          >
            {/* WATER BACKGROUND */}
            <WaterBackground width={FARM_WIDTH} height={FARM_HEIGHT} />

            {/* GRID */}
            <Grid
              brushSize={1}
              groundTiles={groundTiles}
              height={FARM_HEIGHT}
              mode="idle"
              mouseTile={null}
              selectedGroundTile={0}
              showGrid={showGrid}
              width={FARM_WIDTH}
            />

            {/* TOOL HOVER OVERLAY */}
            <ToolHoverOverlay
              mouseTile={mouseTile}
              activeTool={activeTool}
              tilledSoil={tilledSoil}
              activeItem={
                activeSlot?.itemId
                  ? (inventoryActions.getItemDefinition(activeSlot.itemId) ??
                    null)
                  : null
              }
              farmWidth={FARM_WIDTH}
              farmHeight={FARM_HEIGHT}
              entities={entities}
              groundTiles={useCropsGroundTilesStore.getState().groundTiles}
            />

            {/* ENTITIES - Árboles, rocas, etc. */}
            <GameEntities
              entities={entities}
              hoveredEntityId={hoveredEntity}
              mouseTile={mouseTile}
              activeSlot={
                activeSlot?.itemId
                  ? {
                      item:
                        inventoryActions.getItemDefinition(activeSlot.itemId) ??
                        null,
                      quantity:
                        inventoryActions.getItem(activeSlot.itemId)?.quantity ??
                        0,
                    }
                  : null
              }
              tilledSoil={tilledSoil}
              visibleBounds={viewport.visibleBounds}
            />

            {/* Dropped items (from harvesting) */}
            <DroppedItems />
          </Viewport>
        </div>

        {/* MINIMAP */}
        <Minimap
          entities={entities}
          groundTiles={groundTiles}
          tilledSoil={tilledSoil}
          minimap={viewport.minimap}
          viewport={{
            viewportRef: viewport.viewportRef,
            offset: viewport.offset,
            zoom: viewport.zoom,
          }}
        />
      </div>

      {/* CURRENT HOTBAR - Dinámica (Q para cambiar) */}
      <CurrentHotbar />

      {/* DECORATION MENU POPUP */}
      <DecorationMenu />

      {/* INVENTORY MODAL */}
      <Inventory />

      {/* SEED CURSOR GHOST */}
      <SeedCursorGhost
        activeItem={
          activeSlot?.itemId
            ? (inventoryActions.getItemDefinition(activeSlot.itemId) ?? null)
            : null
        }
      />

      {/* DRAG GHOST - Always rendered */}
      {mouseDrag && mouseDrag.isDragging && (
        <div
          style={{
            position: "fixed",
            left: `${mouseDrag.mouseX}px`,
            top: `${mouseDrag.mouseY}px`,
            pointerEvents: "none",
            zIndex: 9999,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "var(--radius-lg)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              background: "rgba(245, 230, 211, 0.7)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.95,
              boxShadow:
                "var(--shadow-float), 0 0 0 1px rgba(255, 255, 255, 0.2) inset",
            }}
          >
            {mouseDrag.toolId ? (
              <span style={{ fontSize: "2rem", lineHeight: 1 }}>
                {TOOLS.find((t) => t.id === mouseDrag.toolId)?.emoji || "🔧"}
              </span>
            ) : mouseDrag.itemId ? (
              (() => {
                const itemDef = ITEM_DEFINITIONS[mouseDrag.itemId]
                if (!itemDef)
                  return <span style={{ fontSize: "2rem" }}>📦</span>

                const spriteStyle = getItemSpriteStyle(itemDef)
                if (spriteStyle) {
                  return (
                    <div
                      style={{
                        ...spriteStyle,
                        transform: "scale(3)",
                        transformOrigin: "center",
                      }}
                    />
                  )
                }
                return (
                  <span style={{ fontSize: "2rem", lineHeight: 1 }}>
                    {itemDef.emoji}
                  </span>
                )
              })()
            ) : (
              <span style={{ fontSize: "2rem" }}>❓</span>
            )}
          </div>
        </div>
      )}

      {/* WELCOME MODAL - First time only */}
      <CropsWelcome isOpen={showWelcome} onClose={handleCloseWelcome} />

      {/* CROP TOOLTIP - On hover without tool */}
      <CropTooltip
        cropId={hoveredCrop?.cropId ?? null}
        tileX={hoveredCrop?.tileX ?? 0}
        tileY={hoveredCrop?.tileY ?? 0}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
      />
    </div>
  )
}

export default CropsFarmView
