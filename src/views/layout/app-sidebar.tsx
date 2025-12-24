import "./app-sidebar.css"

import { Link, useRouterState } from "@tanstack/react-router"
import type { JSX } from "react"

interface AppSidebarProps {
  onClose: () => void
  isClosing?: boolean
}

export const AppSidebar = ({
  onClose,
  isClosing = false,
}: AppSidebarProps): JSX.Element => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <div className={`appSidebar ${isClosing ? "appSidebar--closing" : ""}`}>
      {/* Header with title and close button */}
      <div className="appSidebar__header">
        <h2 className="appSidebar__title">Menu</h2>
        <button
          onClick={onClose}
          className="appSidebar__closeButton"
          title="Cerrar menú"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="appSidebar__content">
        <div className="appSidebar__navSection">
          <div className="appSidebar__navLabel">Labs</div>
          <Link
            to="/farm_laboratory"
            className={`appSidebar__navLink ${currentPath === "/deco_laboratory" ? "appSidebar__navLink--active" : ""}`}
          >
            <span>🔬</span>
            <span>Deco Laboratory</span>
          </Link>
          <Link
            to="/crops_farm"
            className={`appSidebar__navLink ${currentPath === "/crops_farm" ? "appSidebar__navLink--active" : ""}`}
          >
            <span>🏡</span>
            <span>Crops Farm Laboratory</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
