import { Link, useRouterState } from "@tanstack/react-router"
import type { ReactElement } from "react"

interface BackToMenuButtonProps {
  onHelpClick?: () => void
}

/**
 * Botón flotante para regresar al menú principal
 * Se oculta cuando ya estás en el menú principal
 * Opcionalmente muestra un botón de ayuda "?" para mostrar el overlay de bienvenida
 */
export const BackToMenuButton = ({
  onHelpClick,
}: BackToMenuButtonProps): ReactElement | null => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // No mostrar en el menú principal ni en el atlas editor
  if (currentPath === "/" || currentPath === "/atlas_editor") return null

  const buttonStyle: React.CSSProperties = {
    padding: "10px 16px",
    background: "rgba(30, 30, 40, 0.9)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }

  const helpButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    padding: "10px 16px",
  }

  const handleHover = (e: React.MouseEvent<HTMLElement>, isEnter: boolean) => {
    const target = e.currentTarget
    if (isEnter) {
      target.style.background = "rgba(40, 40, 50, 0.95)"
      target.style.transform = "translateY(-2px)"
      target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)"
    } else {
      target.style.background = "rgba(30, 30, 40, 0.9)"
      target.style.transform = "translateY(0)"
      target.style.boxShadow = "none"
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        left: "16px",
        zIndex: 10000,
        display: "flex",
        gap: "8px",
      }}
    >
      <Link
        to="/"
        style={buttonStyle}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        <span>←</span>
        <span>Menu</span>
      </Link>

      {onHelpClick && (
        <button
          onClick={onHelpClick}
          style={helpButtonStyle}
          onMouseEnter={(e) => handleHover(e as any, true)}
          onMouseLeave={(e) => handleHover(e as any, false)}
          title="Show Help"
        >
          ?
        </button>
      )}
    </div>
  )
}
