import { Link } from "@tanstack/react-router"
import type { ReactElement } from "react"
import { useTranslation } from "react-i18next"

import { LanguageSelector } from "@/components/LanguageSelector/LanguageSelector"
import { musicPlayerActions } from "@/engine/musicPlayerStore"

/**
 * Vista principal del menú - Landing page
 * Muestra 3 opciones: Designer, Crops, y Game
 */
export const MainMenu = (): ReactElement => {
  const { t } = useTranslation("menu")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Language Selector */}
      <LanguageSelector />
      {/* Logo */}
      <img
        src="/images/lofivalleyengine_logo_.png"
        alt="Lofi Valley Engine"
        style={{
          maxWidth: 300,
          height: "auto",
          marginBottom: "1rem",
        }}
      />

      {/* Prototype Notice */}
      <div
        style={{
          background: "rgba(102, 126, 234, 0.1)",
          border: "1px solid rgba(102, 126, 234, 0.3)",
          borderRadius: 12,
          padding: "16px 24px",
          marginBottom: "2rem",
          maxWidth: 500,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.9)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          ✨ <strong>{t("prototype.thanks")}</strong>
        </p>
        <p
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.7)",
            margin: "8px 0 0 0",
            lineHeight: 1.5,
          }}
        >
          {t("prototype.notice")}
        </p>
        <button
          onClick={() => musicPlayerActions.open()}
          style={{
            marginTop: 12,
            padding: "8px 16px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: 8,
            color: "white",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ filter: "grayscale(1) brightness(2)" }}>🎵</span>{" "}
          {t("prototype.openRadio")}
        </button>
      </div>

      {/* Menu Cards */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "1200px",
        }}
      >
        {/* Designer Card */}
        <Link
          to="/farm_laboratory"
          style={{
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "280px",
              height: "320px",
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
              border: "2px solid rgba(102, 126, 234, 0.3)",
              borderRadius: "16px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)"
              e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.6)"
              e.currentTarget.style.boxShadow =
                "0 20px 40px rgba(102, 126, 234, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.3)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎨</div>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
                color: "white",
              }}
            >
              {t("cards.designer.title")}
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
              }}
            >
              {t("cards.designer.description")}
            </p>
          </div>
        </Link>

        {/* Crops Card */}
        <Link
          to="/crops_farm"
          style={{
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "280px",
              height: "320px",
              background:
                "linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
              border: "2px solid rgba(72, 187, 120, 0.3)",
              borderRadius: "16px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)"
              e.currentTarget.style.borderColor = "rgba(72, 187, 120, 0.6)"
              e.currentTarget.style.boxShadow =
                "0 20px 40px rgba(72, 187, 120, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.borderColor = "rgba(72, 187, 120, 0.3)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌾</div>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
                color: "white",
              }}
            >
              {t("cards.crops.title")}
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
              }}
            >
              {t("cards.crops.description")}
            </p>
          </div>
        </Link>

        {/* Game Card */}
        {/* <Link
          to="/game"
          style={{
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "280px",
              height: "320px",
              background:
                "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
              border: "2px solid rgba(147, 147, 147, 0.3)",
              borderRadius: "16px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)"
              e.currentTarget.style.borderColor = "rgba(182, 182, 182, 0.6)"
              e.currentTarget.style.boxShadow =
                "0 20px 40px rgba(193, 186, 167, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.borderColor = "rgba(138, 135, 127, 0.3)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎮</div>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
                color: "white",
              }}
            >
              {t("cards.game.title")}
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
              }}
            >
              {t("cards.game.description")}
            </p>
          </div>
        </Link> */}
      </div>

      {/* Social Links */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 60,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {/* GitHub Repo */}
        <a
          href="https://github.com/Leoocast/lofi-valley-engine"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "white",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            transition: "all 0.2s",
          }}
          title="GitHub Repository"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          <svg height="20" width="20" viewBox="0 0 16 16" fill="white">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {t("social.github")}
        </a>

        {/* Discord */}
        <a
          href="https://discord.gg/THyDvy4ZVn"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            background: "#5865F2",
            borderRadius: 8,
            color: "white",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            transition: "all 0.2s",
          }}
          title="Join Discord"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#4752C4"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#5865F2"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          <svg height="18" width="18" viewBox="0 0 127.14 96.36" fill="white">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
          </svg>
          {t("social.discord")}
        </a>

        {/* Bluesky */}
        <a
          href="https://bsky.app/profile/arkydev.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            background: "#0085FF",
            borderRadius: 8,
            color: "white",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            transition: "all 0.2s",
          }}
          title="Follow on Bluesky"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0066CC"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0085FF"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          <svg height="18" width="18" viewBox="0 0 360 320" fill="white">
            <path d="M180 142c-16.3-31.7-60.7-90.8-102-120C38.5-5.9 0 1.4 0 45.4c0 19.1 10.9 160.9 17.2 184 8.2 30.1 38.1 40.4 64.8 35.4-50.2 8.8-107.9 28.6-107.9 90.1 0 26.7 20.6 70.3 116.8 54.3 95.7-15.9 120.1-72.2 120.1-101.6V180.2c0 29.4 24.4 85.7 120.1 101.6 96.2 16 116.8-27.6 116.8-54.3 0-61.5-57.7-81.3-107.9-90.1 26.7 5 56.6-5.3 64.8-35.4C411.1 78.3 422 26.5 422 7.4c0-44-38.5-51.3-78-23.4-41.3 29.2-85.7 88.3-102 120C227.1 133.9 211.1 142 180 142z" />
          </svg>
          {t("social.bluesky")}
        </a>
      </div>
    </div>
  )
}

export default MainMenu
