import "./GameTimeDisplay.css"

import { worldActions } from "@/engine/store"
import { useWorld } from "@/hooks/useWorld"

/**
 * Global component displaying game time and pause controls
 * Should be visible in all app views
 */
export function GameTimeDisplay() {
  // Atomic selectors: only re-renders when these specific values change
  const hour = useWorld((s) => s.gameTime.hour)
  const minute = useWorld((s) => s.gameTime.minute)
  const day = useWorld((s) => s.gameTime.day)
  const isPaused = useWorld((s) => s.isPaused)

  // Format hour and minute with leading zeros
  const formattedHour = hour.toString().padStart(2, "0")
  const formattedMinute = minute.toString().padStart(2, "0")

  return (
    <div className="gameTimeDisplay">
      {/* Time display */}
      <div className="gameTimeDisplay__time">
        <span className="gameTimeDisplay__day">Día {day}</span>
        <span className="gameTimeDisplay__clock">
          {formattedHour}:{formattedMinute}
        </span>
      </div>

      {/* Divider */}
      <div className="gameTimeDisplay__divider" />

      {/* Pause control */}
      <button
        type="button"
        className="gameTimeDisplay__pauseButton"
        onClick={() => worldActions.togglePause()}
        title={isPaused ? "Reanudar" : "Pausar"}
      >
        {isPaused ? "▶" : "⏸"}
      </button>
    </div>
  )
}
