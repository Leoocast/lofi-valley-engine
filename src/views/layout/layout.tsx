import { Outlet, useLocation } from "@tanstack/react-router"
import { useState } from "react"
import { useStore } from "zustand"

import type { JSX } from "react"

import { BackToMenuButton } from "@/components/BackToMenuButton/BackToMenuButton"
import { MusicPlayer } from "@/components/MusicPlayer/MusicPlayer"
import { helpActions } from "@/engine/helpStore"
import { musicPlayerActions, musicPlayerStore } from "@/engine/musicPlayerStore"
import { AppSidebar } from "./app-sidebar"
import { GameTimeWidget } from "./game-time-widget"

const Page = (): JSX.Element => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const location = useLocation()

  // Music player state (global, persists across views)
  const isMusicOpen = useStore(musicPlayerStore, (s) => s.isOpen)

  // Hide time widget and menu in laboratory and devtools
  const isDevtools =
    location.pathname.includes("laboratory") ||
    location.pathname.includes("atlas_editor")

  // Show time widget ONLY in crops_farm
  const showTimeWidget = location.pathname === "/crops_farm"

  // Show help button in laboratory and crops views
  const showHelpButton =
    location.pathname === "/farm_laboratory" ||
    location.pathname === "/crops_farm"

  const handleCloseSidebar = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowSidebar(false)
      setIsClosing(false)
    }, 200) // Match animation duration
  }

  const handleOpenSidebar = () => {
    setShowSidebar(true)
    setIsClosing(false)
  }

  return (
    <>
      {/* Back to Menu button - shown on all routes except main menu */}
      <BackToMenuButton
        onHelpClick={showHelpButton ? helpActions.open : undefined}
      />

      {/* Time widget - ONLY shown in crops_farm */}
      {showTimeWidget && <GameTimeWidget />}

      {/* Floating menu button - hidden in devtools */}
      {!isDevtools && showTimeWidget && (
        <button
          onClick={handleOpenSidebar}
          className="floatingMenuButton"
          title={showSidebar ? "Cerrar menú" : "Abrir menú"}
        >
          ☰
        </button>
      )}

      {/* Floating sidebar - appears below menu button with animations */}
      {showSidebar && (
        <AppSidebar onClose={handleCloseSidebar} isClosing={isClosing} />
      )}

      {/* Main content */}
      <Outlet />

      {/* Music Player - Global, persists across all views */}
      <MusicPlayer isOpen={isMusicOpen} onToggle={musicPlayerActions.toggle} />
    </>
  )
}

export default Page
