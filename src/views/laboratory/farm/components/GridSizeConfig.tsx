/**
 * GridSizeConfig - Dropdown to configure grid width and height
 *
 * Shows a dropdown with presets and custom size option.
 * Confirms with user before changing (clears all data).
 */

import React, { useState } from "react"

interface GridSizeConfigProps {
  currentWidth: number
  currentHeight: number
  onSizeChange: (width: number, height: number) => void
}

const SIZE_PRESETS = [
  { label: "8×8 (Small)", width: 8, height: 8 },
  { label: "16×16 (Default)", width: 16, height: 16 },
  { label: "24×24 (Medium)", width: 24, height: 24 },
  { label: "32×32 (Large)", width: 32, height: 32 },
  { label: "48×48 (XL)", width: 48, height: 48 },
  { label: "64×64 (XXL)", width: 64, height: 64 },
]

export const GridSizeConfig: React.FC<GridSizeConfigProps> = ({
  currentWidth,
  currentHeight,
  onSizeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [customWidth, setCustomWidth] = useState(currentWidth)
  const [customHeight, setCustomHeight] = useState(currentHeight)

  const handlePresetSelect = (width: number, height: number) => {
    if (width === currentWidth && height === currentHeight) {
      setIsOpen(false)
      return
    }

    if (
      confirm(
        `Change grid to ${width}×${height}?\n\n⚠️ This will clear all tiles and entities!`,
      )
    ) {
      onSizeChange(width, height)
    }
    setIsOpen(false)
  }

  const handleCustomApply = () => {
    const w = Math.max(4, Math.min(128, customWidth))
    const h = Math.max(4, Math.min(128, customHeight))

    if (w === currentWidth && h === currentHeight) {
      setShowCustom(false)
      setIsOpen(false)
      return
    }

    if (
      confirm(
        `Change grid to ${w}×${h}?\n\n⚠️ This will clear all tiles and entities!`,
      )
    ) {
      onSizeChange(w, h)
      setShowCustom(false)
      setIsOpen(false)
    }
  }

  const currentPreset = SIZE_PRESETS.find(
    (p) => p.width === currentWidth && p.height === currentHeight,
  )
  const currentLabel =
    currentPreset?.label ?? `${currentWidth}×${currentHeight}`

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "0.375rem 0.75rem",
          fontSize: "0.875rem",
          background: "rgba(100, 100, 200, 0.2)",
          border: "1px solid rgba(100, 100, 200, 0.4)",
          borderRadius: "0.375rem",
          color: "white",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
        title="Grid Size"
      >
        📐 {currentLabel}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
            }}
            onClick={() => {
              setIsOpen(false)
              setShowCustom(false)
            }}
          />

          {/* Dropdown */}
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              right: 0,
              background: "rgba(30, 30, 45, 0.98)",
              borderRadius: 8,
              padding: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              zIndex: 1000,
              minWidth: 180,
            }}
          >
            {!showCustom ? (
              <>
                {SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() =>
                      handlePresetSelect(preset.width, preset.height)
                    }
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px 12px",
                      fontSize: 13,
                      background:
                        preset.width === currentWidth &&
                        preset.height === currentHeight
                          ? "rgba(100, 180, 255, 0.3)"
                          : "transparent",
                      border: "none",
                      borderRadius: 4,
                      color: "white",
                      cursor: "pointer",
                      textAlign: "left",
                      marginBottom: 2,
                    }}
                  >
                    {preset.label}
                    {preset.width === currentWidth &&
                      preset.height === currentHeight &&
                      " ✓"}
                  </button>
                ))}

                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.1)",
                    margin: "8px 0",
                  }}
                />

                <button
                  onClick={() => setShowCustom(true)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: 13,
                    background: "transparent",
                    border: "none",
                    borderRadius: 4,
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  ⚙️ Custom size...
                </button>
              </>
            ) : (
              <div style={{ padding: 4 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 8,
                  }}
                >
                  CUSTOM SIZE (4-128)
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <div>
                    <label
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
                    >
                      Width
                    </label>
                    <input
                      type="number"
                      min={4}
                      max={128}
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      style={{
                        display: "block",
                        width: 60,
                        padding: "6px 8px",
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: 4,
                        color: "white",
                        fontSize: 13,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
                    >
                      Height
                    </label>
                    <input
                      type="number"
                      min={4}
                      max={128}
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      style={{
                        display: "block",
                        width: 60,
                        padding: "6px 8px",
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: 4,
                        color: "white",
                        fontSize: 13,
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setShowCustom(false)}
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      fontSize: 12,
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 4,
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomApply}
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      fontSize: 12,
                      background: "rgba(100, 180, 255, 0.3)",
                      border: "1px solid rgba(100, 180, 255, 0.5)",
                      borderRadius: 4,
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
