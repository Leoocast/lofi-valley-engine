import type { ReactElement } from "react"
import { useTranslation } from "react-i18next"

import type { CropEntity } from "@/engine/interfaces/crops"
import { getCropConfig } from "@/engine/rendering/cropRenderer"
import { useWorld } from "@/hooks/useWorld"

interface CropTooltipProps {
  cropId: string | null
  tileX: number
  tileY: number
  mouseX: number
  mouseY: number
}

/**
 * Format minutes to human readable time
 */
function formatTime(minutes: number, readyText: string): string {
  if (minutes <= 0) return readyText
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (hours < 24) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  const days = Math.floor(hours / 24)
  const remainHours = hours % 24
  return remainHours > 0 ? `${days}d ${remainHours}h` : `${days}d`
}

/**
 * CropTooltip - Shows crop info on hover without tool selected
 * Fetches fresh crop data every render for real-time updates
 */
export const CropTooltip = ({
  cropId,
  tileX,
  tileY,
  mouseX,
  mouseY,
}: CropTooltipProps): ReactElement | null => {
  const { t } = useTranslation("crops")
  // Subscribe to game time AND entities for real-time updates
  const totalMinutes = useWorld((s) => s.gameTime.totalMinutes)
  const entities = useWorld((s) => s.entities)

  if (!cropId) return null

  // Fetch fresh crop data every render
  const crop = entities.find(
    (e) => e.type === "crop" && e.x === tileX && e.y === tileY,
  ) as CropEntity | undefined

  if (!crop) return null

  const config = getCropConfig(crop.cropId)
  const maxStages = config.growthStages
  const minutesPerStage = config.growthTimePerStage

  // Calculate progress within current stage for smooth bar
  const totalGrowthNeeded = (maxStages - 1) * minutesPerStage
  const currentGrowthMinutes = crop.totalGrowthMinutes

  // Calculate precise progress including partial stage
  const isFullyGrown = crop.currentStage >= maxStages - 1
  const progressPercent = isFullyGrown
    ? 100
    : Math.min(100, (currentGrowthMinutes / totalGrowthNeeded) * 100)

  // Calculate time remaining
  const minutesRemaining = Math.max(0, totalGrowthNeeded - currentGrowthMinutes)

  // Status text
  let status = ""
  let statusColor = "#fff"

  if (crop.isDead) {
    status = `💀 ${t("tooltip.dead")}`
    statusColor = "#ff6666"
  } else if (crop.canHarvest) {
    status = `✨ ${t("tooltip.readyToHarvest")}`
    statusColor = "#7dd87d"
  } else if (!crop.isWatered) {
    status = `💧 ${t("tooltip.needsWater")}`
    statusColor = "#6bb8ff"
  } else {
    status = `🌱 ${t("tooltip.growing")}`
    statusColor = "#a8d86b"
  }

  // Juicy harvest state
  const harvestGlow = crop.canHarvest && !crop.isDead

  return (
    <div
      style={{
        position: "fixed",
        left: mouseX + 20,
        top: mouseY - 16,
        background: "rgba(45, 38, 32, 0.97)",
        backdropFilter: "blur(12px)",
        border: harvestGlow ? "4px solid #7CB342" : "4px solid #8B7355",
        borderRadius: 12,
        padding: "14px 18px",
        zIndex: 10000,
        pointerEvents: "none",
        minWidth: 200,
        boxShadow: harvestGlow
          ? "0 8px 24px rgba(100, 180, 100, 0.4), 0 0 20px rgba(124, 179, 66, 0.3)"
          : "0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.25)",
        animation: harvestGlow
          ? "pulse-glow 1.5s ease-in-out infinite"
          : "none",
      }}
    >
      {/* CSS Animation for harvest glow */}
      {harvestGlow && (
        <style>
          {`
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 8px 24px rgba(100, 180, 100, 0.4), 0 0 20px rgba(124, 179, 66, 0.3); }
              50% { box-shadow: 0 8px 30px rgba(100, 180, 100, 0.6), 0 0 35px rgba(124, 179, 66, 0.5); }
            }
          `}
        </style>
      )}

      {/* Crop Name */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: harvestGlow ? "#A5D66F" : "#E8DCC8",
          marginBottom: 10,
          fontFamily: "'Outfit', sans-serif",
          textShadow: harvestGlow ? "0 0 8px rgba(165, 214, 111, 0.5)" : "none",
        }}
      >
        {config.name} {harvestGlow && "✨"}
      </div>

      {/* Status */}
      <div
        style={{
          fontSize: 14,
          color: statusColor,
          marginBottom: 12,
          fontWeight: 600,
          padding: "6px 10px",
          borderRadius: 6,
          background: crop.isDead
            ? "rgba(255, 100, 100, 0.2)"
            : crop.canHarvest
              ? "rgba(124, 179, 66, 0.25)"
              : !crop.isWatered
                ? "rgba(100, 150, 220, 0.2)"
                : "rgba(130, 180, 90, 0.2)",
        }}
      >
        {status}
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: 10,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: 5,
          overflow: "hidden",
          marginBottom: 10,
          border: "2px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: "100%",
            background: crop.isDead
              ? "#D46A6A"
              : crop.canHarvest
                ? "linear-gradient(90deg, #7CB342, #A5D66F)"
                : "linear-gradient(90deg, #64B5F6, #81C784)",
            borderRadius: 3,
            transition: "width 0.3s ease",
            boxShadow: harvestGlow ? "0 0 8px rgba(124, 179, 66, 0.6)" : "none",
          }}
        />
      </div>

      {/* Stage Info */}
      <div
        style={{
          fontSize: 14,
          color: harvestGlow ? "#A5D66F" : "#C4B59A",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 500,
        }}
      >
        <span>
          {harvestGlow
            ? `🌾 ${t("tooltip.ready")}`
            : `${t("tooltip.stage")} ${crop.currentStage + 1}/${maxStages}`}
        </span>
        {!crop.isDead && !crop.canHarvest && minutesRemaining > 0 && (
          <span style={{ color: "#64B5F6", fontWeight: 600 }}>
            ~{formatTime(minutesRemaining, t("tooltip.ready"))}
          </span>
        )}
      </div>

      {/* Watered indicator */}
      {crop.isWatered && !crop.canHarvest && !crop.isDead && (
        <div
          style={{
            fontSize: 13,
            color: "#64B5F6",
            marginTop: 8,
            fontWeight: 500,
          }}
        >
          💧 {t("tooltip.watered")}
        </div>
      )}
    </div>
  )
}
