/**
 * FarmManager - Modal for managing saved farms
 * Save, Load, Delete, and Share farms
 */

import type { GroundTile } from "@/engine/autotiling/groundAutotiling"
import type { Entity } from "@/engine/interfaces/entity"
import {
  deleteFarm,
  downloadFarmAsFile,
  entriesToGroundTiles,
  generateFarmId,
  importFarmFromFile,
  listFarms,
  loadFarm,
  saveFarm,
} from "@/services/farmStorage"
import React, { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

interface FarmManagerProps {
  isOpen: boolean
  onClose: () => void
  // Current farm state
  currentFarmId: string | null
  currentFarmName: string
  groundTiles: Map<string, GroundTile>
  entities: Entity[]
  farmWidth: number
  farmHeight: number
  // Callbacks
  onLoadFarm: (
    id: string,
    name: string,
    groundTiles: Map<string, GroundTile>,
    entities: Entity[],
    width: number,
    height: number,
  ) => void
  onNewFarm: () => void
  onFarmNameChange: (name: string) => void
}

export const FarmManager: React.FC<FarmManagerProps> = ({
  isOpen,
  onClose,
  currentFarmId,
  currentFarmName,
  groundTiles,
  entities,
  farmWidth,
  farmHeight,
  onLoadFarm,
  onNewFarm,
  onFarmNameChange,
}) => {
  const { t } = useTranslation("laboratory")
  const [farms, setFarms] = useState(() => listFarms())
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(currentFarmName)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const refreshList = () => setFarms(listFarms())

  const handleSave = () => {
    const id = currentFarmId || generateFarmId()
    saveFarm(
      id,
      currentFarmName || t("farmManager.untitled"),
      groundTiles,
      entities,
      farmWidth,
      farmHeight,
    )
    refreshList()
    // Show saved feedback
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLoad = (id: string) => {
    const farm = loadFarm(id)
    if (farm) {
      const tiles = entriesToGroundTiles(farm.data.groundTiles)
      const width = farm.data.width || 16
      const height = farm.data.height || 16
      onLoadFarm(farm.id, farm.name, tiles, farm.data.entities, width, height)
      onClose()
    }
  }

  const handleDelete = (id: string) => {
    if (confirm(t("farmManager.deleteConfirm"))) {
      deleteFarm(id)
      refreshList()
    }
  }

  const handleDownload = () => {
    const id = currentFarmId || generateFarmId()
    const farm = saveFarm(
      id,
      currentFarmName || t("farmManager.untitled"),
      groundTiles,
      entities,
      farmWidth,
      farmHeight,
    )
    downloadFarmAsFile(farm)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const farm = await importFarmFromFile(file)
      const tiles = entriesToGroundTiles(farm.data.groundTiles)
      const width = farm.data.width || 16
      const height = farm.data.height || 16
      onLoadFarm(farm.id, farm.name, tiles, farm.data.entities, width, height)
      onClose()
    } catch (err) {
      alert(t("farmManager.importError"))
    }
  }

  const handleNewFarm = () => {
    onNewFarm()
    onClose()
  }

  const handleNameSave = () => {
    onFarmNameChange(tempName)
    setEditingName(false)
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "rgba(30, 30, 45, 0.98)",
          borderRadius: 12,
          padding: 24,
          width: 500,
          maxHeight: "80vh",
          overflow: "auto",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0, color: "white", fontSize: 18 }}>
            🗂️ {t("farmManager.title")}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Current Farm */}
        <div
          style={{
            background: "rgba(100, 180, 255, 0.1)",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            border: "1px solid rgba(100, 180, 255, 0.3)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 4,
            }}
          >
            {t("farmManager.currentFarm")}
          </div>
          {editingName ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 4,
                  color: "white",
                  fontSize: 14,
                }}
              />
              <button onClick={handleNameSave} style={btnStyle}>
                ✓
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setTempName(currentFarmName)
                setEditingName(true)
              }}
              style={{ color: "white", fontSize: 14, cursor: "pointer" }}
            >
              {currentFarmName || t("farmManager.untitled")} ✏️
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleSave}
            style={{
              ...primaryBtnStyle,
              minWidth: 100,
              ...(saved && { background: "rgba(100, 200, 100, 0.5)" }),
            }}
          >
            {saved
              ? `✅ ${t("farmManager.saved")}`
              : `💾 ${t("farmManager.save")}`}
          </button>
          <button onClick={handleDownload} style={btnStyle}>
            📥 {t("farmManager.download")}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={btnStyle}
          >
            📤 {t("farmManager.import")}
          </button>
          <button onClick={handleNewFarm} style={btnStyle}>
            ➕ {t("farmManager.new")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </div>

        {/* Saved Farms List */}
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 8,
          }}
        >
          {t("farmManager.savedFarms")} ({farms.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {farms.length === 0 ? (
            <div
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                padding: 12,
                textAlign: "center",
              }}
            >
              {t("farmManager.noFarms")}
            </div>
          ) : (
            farms.map((farm) => (
              <div
                key={farm.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background:
                    farm.id === currentFarmId
                      ? "rgba(100, 180, 255, 0.2)"
                      : "rgba(255,255,255,0.05)",
                  borderRadius: 6,
                  border:
                    farm.id === currentFarmId
                      ? "1px solid rgba(100, 180, 255, 0.5)"
                      : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div>
                  <div style={{ color: "white", fontSize: 13 }}>
                    {farm.name}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
                    {new Date(farm.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleLoad(farm.id)}
                    style={smallBtnStyle}
                    title={t("farmManager.load")}
                  >
                    {t("farmManager.load")}
                  </button>
                  <button
                    onClick={() => handleDelete(farm.id)}
                    style={{
                      ...smallBtnStyle,
                      background: "rgba(255,100,100,0.2)",
                    }}
                    title={t("farmManager.delete")}
                  >
                    {t("farmManager.delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Button styles
const btnStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 12,
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 6,
  color: "white",
  cursor: "pointer",
}

const primaryBtnStyle: React.CSSProperties = {
  ...btnStyle,
  background: "rgba(100, 180, 255, 0.3)",
  border: "1px solid rgba(100, 180, 255, 0.5)",
}

const smallBtnStyle: React.CSSProperties = {
  padding: "4px 8px",
  fontSize: 12,
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4,
  cursor: "pointer",
}
