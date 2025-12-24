import type { ReactElement } from "react"
import { Fragment } from "react"

import "./GameEntities.css"

import { CROPS_DATA } from "@/engine/data/cropsData"
import type { CropEntity } from "@/engine/interfaces/crops"
import type { Entity } from "@/engine/interfaces/entity"

import { HealthBar } from "@/components/HealthBar/HealthBar"
import { ANIMATION_DURATIONS } from "@/engine/animationEngine"
import { TILE_SIZE } from "@/engine/rendering/config"
import { getCropIndex } from "@/engine/rendering/cropRenderer"
import { renderEntity } from "@/engine/rendering/spritesheetRenderer"
import {
  isEntityVisible,
  type ViewportBounds,
} from "@/engine/rendering/viewportCulling"
import {
  getLogicalSize,
  getVisualOffset,
} from "@/engine/rendering/visualBoundsAndOffset"
import { useWorld } from "@/hooks/useWorld"
import { isToolCompatible } from "@/utils/isToolCompatible"

interface GameEntitiesProps {
  entities: Entity[]
  hoveredEntityId?: string | null
  mouseTile?: { x: number; y: number } | null
  activeSlot?: any
  tilledSoil?: Map<string, any>
  visibleBounds?: ViewportBounds
}

/**
 * Get visual Y offset for a crop entity
 * Only tall stages get -16px offset (32px tall sprites extend above tile)
 * Normal stages (16px) have no offset
 */
function getCropVisualOffset(cropEntity: CropEntity): { x: number; y: number } {
  const cropIndex = getCropIndex(cropEntity.cropId)
  if (cropIndex === -1) return { x: 0, y: 0 }

  const crop = CROPS_DATA.crops[cropIndex]
  const currentStage = cropEntity.currentStage

  // Check if current stage is a tall stage
  const isTallStage = crop.tallStages.includes(currentStage)

  // Only tall stages need offset (32px sprite extends 16px above tile)
  return { x: 0, y: isTallStage ? -16 : 0 }
}

/**
 * GameEntities - Renderizado simple de entidades para modo juego
 * Sin lógica de editor (place, move, delete, etc.)
 *
 * Optimizado para evitar jitter en hover usando outline + will-change
 * Includes viewport culling - only renders entities within visible bounds
 */
export const GameEntities = ({
  entities,
  hoveredEntityId,
  mouseTile,
  activeSlot,
  tilledSoil,
  visibleBounds,
}: GameEntitiesProps): ReactElement => {
  // Obtener herramienta activa para validar compatibilidad
  const activeTool = useWorld((s) => s.activeTool)

  // Filter entities by visibility (viewport culling)
  const visibleEntities = visibleBounds
    ? entities.filter((ent) => {
        const size = getLogicalSize(ent.sprite)
        return isEntityVisible(ent.x, ent.y, size.w, size.h, visibleBounds)
      })
    : entities

  // Ordenar por profundidad (Y + altura)
  const sorted = visibleEntities
    .map((ent, idx) => ({ ent, idx }))
    .sort((a, b) => {
      const aSize = getLogicalSize(a.ent.sprite)
      const bSize = getLogicalSize(b.ent.sprite)
      const aDepth = a.ent.y + aSize.h
      const bDepth = b.ent.y + bSize.h
      return aDepth - bDepth
    })

  return (
    <>
      {sorted.map(({ ent, idx }) => {
        const size = getLogicalSize(ent.sprite)

        // Use dynamic offset for crops, standard offset for others
        const visual =
          ent.type === "crop"
            ? getCropVisualOffset(ent as CropEntity)
            : getVisualOffset(ent.sprite)

        const depth = (ent.y + size.h) * 1000

        // Hover effect - outline sólido que SIGUE LA FORMA del PNG
        const isHovered = hoveredEntityId === ent.id

        // Para crops con scythe/watering: detectar por mouseTile (ignora árboles encima)
        const isCropAtMouseTile =
          ent.type === "crop" &&
          mouseTile &&
          ent.x === mouseTile.x &&
          ent.y === mouseTile.y &&
          (activeTool === "scythe" || activeTool === "wateringCan")

        // Mostrar borde si: hover directo O crop bajo mouse con scythe/watering
        const shouldShowBorder = isHovered || isCropAtMouseTile

        // Detectar si está usando herramienta de tile o tiene semillas
        // Pickaxe NO está aquí porque necesita mostrar borde en rocas
        // Scythe SÍ está aquí para ocultar árboles y permitir harvest detrás
        const isTileTool =
          activeTool === "hoe" ||
          activeTool === "wateringCan" ||
          activeTool === "scythe" ||
          activeSlot?.item?.type === "seed"

        // Validar si la herramienta es compatible con la entidad
        const toolIsCompatible = isToolCompatible(activeTool, ent.sprite.id)

        // Color del borde con lógica especial para crops
        let borderColor = "rgba(255, 255, 255, 1)" // Blanco por defecto

        if (ent.type === "crop") {
          // Watercan sobre crops: siempre azul (va a regar)
          if (activeTool === "wateringCan") {
            borderColor = "rgba(0, 191, 255, 1)" // Azul
          }
          // Scythe sobre crops: verde si listo, rojo si no
          else if (activeTool === "scythe") {
            const cropEntity = ent as any
            borderColor = cropEntity.canHarvest
              ? "rgba(144, 238, 144, 1)" // Verde - listo
              : "rgba(255, 0, 0, 1)" // Rojo - no listo
          }
        } else {
          // Para árboles/rocas: lógica especial
          if (isTileTool) {
            // Hoe/watering/semillas: ocultar borde siempre
            borderColor = "rgba(0, 0, 0, 0)"
          } else if (activeTool === "pickaxe") {
            // Pickaxe: mostrar borde en ROCAS, ocultar en árboles
            if (ent.sprite.id === "rock") {
              borderColor = toolIsCompatible
                ? "rgba(255, 255, 255, 1)" // Blanco
                : "rgba(255, 0, 0, 1)" // Rojo
            } else {
              borderColor = "rgba(0, 0, 0, 0)" // Transparente para árboles
            }
          } else {
            borderColor = toolIsCompatible
              ? "rgba(255, 255, 255, 1)" // Blanco
              : "rgba(255, 0, 0, 1)" // Rojo
          }
        }

        const hoverFilter = shouldShowBorder
          ? `drop-shadow(0px -1px 0 ${borderColor}) 
             drop-shadow(0px 1px 0 ${borderColor}) 
             drop-shadow(-.5px 0px 0 ${borderColor}) 
             drop-shadow(1px 0px 0 ${borderColor})`
          : "none"

        // Animation - usar ANIMATION_DURATIONS del engine
        const animationName = ent.currentAnimation
        const animationDuration = animationName
          ? `${ANIMATION_DURATIONS[animationName]}ms`
          : "0ms"
        const animationCSS = animationName
          ? `${animationName} ${animationDuration} cubic-bezier(.36,.07,.19,.97) both`
          : "none"

        // Calcular posición del centro para la barra de HP
        // Usar realWidth para centrar correctamente (árbol 3 tiles, roca 1 tile)
        const entityCenterX =
          ent.x * TILE_SIZE + visual.x + (ent.sprite.realWidth * TILE_SIZE) / 2
        const entityTopY = ent.y * TILE_SIZE + visual.y

        // Mostrar HP bar solo cuando: hover + ha sido dañada + NO es tile tool
        // Pickaxe: mostrar HP bar en rocas, ocultar en árboles
        const showHpBar =
          isHovered &&
          ent.hp !== undefined &&
          ent.maxHp !== undefined &&
          ent.hp < ent.maxHp &&
          (!isTileTool ||
            (activeTool === "pickaxe" && ent.sprite.id === "rock")) // Mostrar HP bar con pickaxe en rocas

        // Detectar si está usando herramienta de tile o tiene semillas
        const hasSeeds = activeSlot?.item?.type === "seed"
        // isTileTool ya está declarado arriba, reutilizarlo

        // Encontrar si hay algún árbol siendo hovered
        const hoveredTreeRock = entities.find(
          (e) => e.id === hoveredEntityId && e.sprite.id === "tree",
        )

        // Árbol que bloquea vista: fade si está cerca del árbol hovered
        // SOLO ARBOLES, NO ROCAS
        // Incluye pickaxe, hoe, watering, scythe, semillas
        const isFadeTool = isTileTool || activeTool === "pickaxe"
        let isBlockingEntity = false

        if (isFadeTool && ent.sprite.id === "tree") {
          if (isHovered) {
            // Este árbol está siendo hovered directamente
            isBlockingEntity = true
          } else if (hoveredTreeRock) {
            // Fade todos los árboles dentro de un rango del árbol hovered
            const FADE_RANGE = 3 // tiles
            const distanceX = Math.abs(ent.x - hoveredTreeRock.x)
            const distanceY = Math.abs(ent.y - hoveredTreeRock.y)

            isBlockingEntity =
              distanceX <= FADE_RANGE && distanceY <= FADE_RANGE
          }
        }

        const opacity = isBlockingEntity ? 0.05 : 1.0

        return (
          <Fragment key={ent.id}>
            {/* HP Bar (solo en hover) */}
            {showHpBar && (
              <HealthBar
                currentHp={ent.hp!}
                maxHp={ent.maxHp!}
                centerX={entityCenterX}
                topY={entityTopY}
                zIndex={depth + 1}
              />
            )}

            {/* Entidad */}
            <div
              style={{
                position: "absolute",
                left: ent.x * TILE_SIZE + visual.x,
                top: ent.y * TILE_SIZE + visual.y,
                zIndex: depth,
                // Drop-shadow que respeta la forma del PNG
                filter: hoverFilter,
                // GPU optimization para evitar jitter
                willChange: "filter, opacity",
                transform: "translateZ(0)", // Mantener en GPU layer
                animation: animationCSS,
                opacity,
                transition: "opacity 0.2s ease",
                ...renderEntity(ent),
              }}
            />
          </Fragment>
        )
      })}
    </>
  )
}
