import React from "react"
import { useTranslation } from "react-i18next"

import styles from "../farm_laboratory_view.module.scss"

import { GridSizeConfig } from "./GridSizeConfig"
import { TimeDropdown, WeatherDropdown } from "./index"

interface LabToolbarProps {
  // Time & Weather
  timeOfDay: "day" | "afternoon" | "night"
  onTimeChange: (time: "day" | "afternoon" | "night") => void
  weather: "sunny" | "rain" | "storm" | "snow"
  onWeatherChange: (weather: "sunny" | "rain" | "storm" | "snow") => void
  // Toggles
  hideWater: boolean
  onHideWaterChange: (hide: boolean) => void
  showGrid: boolean
  onShowGridChange: (show: boolean) => void
  // Grid size
  gridWidth: number
  gridHeight: number
  onGridSizeChange: (width: number, height: number) => void
  // Actions
  onReset: () => void
  onOpenFarmManager: () => void
}

/**
 * LabToolbar - Floating toolbar for the farm laboratory
 *
 * Contains controls for:
 * - Reset farm (with confirmation)
 * - Time of day selection
 * - Weather selection
 * - Water visibility toggle
 * - Grid visibility toggle
 * - Grid size configuration
 * - Save/Load (opens FarmManager modal)
 */
export const LabToolbar: React.FC<LabToolbarProps> = ({
  timeOfDay,
  onTimeChange,
  weather,
  onWeatherChange,
  hideWater,
  onHideWaterChange,
  showGrid,
  onShowGridChange,
  gridWidth,
  gridHeight,
  onGridSizeChange,
  onReset,
  onOpenFarmManager,
}) => {
  const { t } = useTranslation("laboratory")

  const handleReset = () => {
    if (confirm(t("toolbar.resetConfirm"))) {
      onReset()
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        background: "rgba(20, 20, 30, 0.92)",
        backdropFilter: "blur(12px)",
        borderRadius: 8,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
      }}
    >
      {/* Reset button - leftmost with confirmation */}
      <button
        onClick={handleReset}
        style={{
          padding: "0.375rem 0.75rem",
          fontSize: "0.875rem",
          background: "rgba(255, 100, 100, 0.2)",
          border: "1px solid rgba(255, 100, 100, 0.4)",
          borderRadius: "0.375rem",
          color: "white",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        title={t("toolbar.resetFarm")}
      >
        🔄
      </button>

      {/* Separator */}
      <div className={styles.separator} />

      {/* Time and Weather dropdowns */}
      <div className={styles.section}>
        <TimeDropdown value={timeOfDay} onChange={onTimeChange} />
        <WeatherDropdown value={weather} onChange={onWeatherChange} />
      </div>

      {/* Separator */}
      <div className={styles.separator} />

      {/* Water Toggle */}
      <button
        onClick={() => onHideWaterChange(!hideWater)}
        style={{
          padding: "0.375rem 0.75rem",
          fontSize: "0.875rem",
          background: hideWater
            ? "rgba(255, 100, 100, 0.2)"
            : "rgba(100, 200, 255, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "0.375rem",
          color: "white",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {hideWater ? "🌊" : "💧"}
      </button>

      {/* Grid Toggle */}
      <button
        onClick={() => onShowGridChange(!showGrid)}
        style={{
          padding: "0.375rem 0.75rem",
          fontSize: "0.875rem",
          background: showGrid
            ? "rgba(100, 200, 100, 0.2)"
            : "rgba(100, 100, 100, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "0.375rem",
          color: "white",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {showGrid ? "🟢" : "⚫"}
      </button>

      {/* Separator */}
      <div className={styles.separator} />

      {/* Grid Size Config */}
      <GridSizeConfig
        currentWidth={gridWidth}
        currentHeight={gridHeight}
        onSizeChange={onGridSizeChange}
      />

      {/* Save button - larger and prominent */}
      <button
        onClick={onOpenFarmManager}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          background: "rgba(100, 200, 100, 0.3)",
          border: "1px solid rgba(100, 200, 100, 0.5)",
          borderRadius: "0.375rem",
          color: "white",
          cursor: "pointer",
          transition: "all 0.2s",
          fontWeight: 500,
        }}
        title={t("toolbar.saveLoad")}
      >
        💾 {t("toolbar.saveLoad")}
      </button>
    </div>
  )
}
