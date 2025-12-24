/**
 * LaboratoryWelcome - One-time welcome modal for the laboratory
 * Shows features, shortcuts, and Discord link
 * Uses localStorage to track if already shown
 */

import React from "react"
import { useTranslation } from "react-i18next"

interface LaboratoryWelcomeProps {
  isOpen: boolean
  onClose: () => void
}

const SHORTCUT_KEYS = [
  "cameraMovement",
  "idleMode",
  "paintMode",
  "toggleGrid",
  "toggleWater",
  "hideUI",
] as const

const FEATURE_KEYS = [
  "resetGrid",
  "timeOfDay",
  "weather",
  "waterVisibility",
  "gridVisibility",
  "gridSize",
  "saveLoad",
] as const

export const LaboratoryWelcome: React.FC<LaboratoryWelcomeProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("laboratory")

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.8)",
          zIndex: 9998,
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(600px, 90vw)",
          maxHeight: "80vh",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          border: "2px solid rgba(100, 180, 255, 0.3)",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 32px",
            background:
              "linear-gradient(90deg, rgba(100, 180, 255, 0.2) 0%, rgba(150, 100, 255, 0.2) 100%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 700,
              background: "linear-gradient(90deg, #64b4ff 0%, #9664ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            🎨 {t("welcome.title")}
          </h1>
          <div
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: 500,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span>{t("welcome.version")}</span>

            <span>
              {t("welcome.assetsBy")}{" "}
              <a
                href="https://cupnooble.itch.io/sprout-lands-asset-pack"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#64b4ff",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none"
                }}
              >
                Cup Nooble
              </a>
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 32px",
          }}
        >
          {/* Introduction */}
          <p
            style={{
              margin: "0 0 32px 0",
              fontSize: 15,
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: t("welcome.introduction") }}
          />

          {/* Keyboard Shortcuts Section */}
          <h2
            style={{
              margin: "0 0 16px 0",
              fontSize: 18,
              color: "white",
              fontWeight: 600,
            }}
          >
            ⌨️ {t("welcome.keyboardShortcuts")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SHORTCUT_KEYS.map((key) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: 12,
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 8,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "white",
                      marginBottom: 4,
                    }}
                  >
                    {t(`welcome.shortcuts.${key}.title`)}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {t(`welcome.shortcuts.${key}.description`)}
                  </div>
                </div>
                <div
                  style={{
                    padding: "4px 12px",
                    background: "rgba(100, 180, 255, 0.2)",
                    border: "1px solid rgba(100, 180, 255, 0.4)",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#64b4ff",
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t(`welcome.shortcuts.${key}.key`)}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255, 255, 255, 0.1)",
              margin: "32px 0",
            }}
          />

          {/* Toolbar Features Section */}
          <h2
            style={{
              margin: "0 0 16px 0",
              fontSize: 18,
              color: "white",
              fontWeight: 600,
            }}
          >
            🎛️ {t("welcome.toolbarFeatures")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FEATURE_KEYS.map((key) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: 12,
                  background: "rgba(150, 100, 255, 0.08)",
                  borderRadius: 8,
                  border: "1px solid rgba(150, 100, 255, 0.2)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "white",
                      marginBottom: 4,
                    }}
                  >
                    {t(`welcome.features.${key}.title`)}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {t(`welcome.features.${key}.description`)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Discord Link */}
          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: "rgba(88, 101, 242, 0.15)",
              border: "1px solid rgba(88, 101, 242, 0.3)",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "white",
                marginBottom: 8,
              }}
            >
              💬 {t("welcome.communityTitle")}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 12,
              }}
            >
              {t("welcome.communityDescription")}
            </div>
            <a
              href="https://discord.gg/hRzEkg39ja"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                background: "#5865F2",
                color: "white",
                textDecoration: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#4752C4"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#5865F2"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <svg
                height="18"
                width="18"
                viewBox="0 0 127.14 96.36"
                fill="white"
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              <span>{t("welcome.joinDiscord")}</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 32px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(0, 0, 0, 0.2)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "12px 32px",
              background: "linear-gradient(90deg, #64b4ff 0%, #9664ff 100%)",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)"
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(100, 180, 255, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            {t("welcome.getStarted")}
          </button>
        </div>
      </div>
    </>
  )
}
