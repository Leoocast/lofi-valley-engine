import type { ReactElement } from "react"
import { useTranslation } from "react-i18next"

/**
 * Language Selector Component
 * Permite cambiar entre inglés y español
 */
export const LanguageSelector = (): ReactElement => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem("lofi-valley-language", lng)
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        display: "flex",
        gap: "8px",
        zIndex: 10000,
      }}
    >
      <button
        onClick={() => changeLanguage("en")}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "600",
          background:
            i18n.language === "en"
              ? "rgba(102, 126, 234, 0.9)"
              : "rgba(255, 255, 255, 0.2)",
          color: "white",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s",
          backdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          if (i18n.language !== "en") {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"
          }
        }}
        onMouseLeave={(e) => {
          if (i18n.language !== "en") {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
          }
        }}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => changeLanguage("es")}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "600",
          background:
            i18n.language === "es"
              ? "rgba(102, 126, 234, 0.9)"
              : "rgba(255, 255, 255, 0.2)",
          color: "white",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s",
          backdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          if (i18n.language !== "es") {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"
          }
        }}
        onMouseLeave={(e) => {
          if (i18n.language !== "es") {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
          }
        }}
      >
        🇪🇸 ES
      </button>
    </div>
  )
}
