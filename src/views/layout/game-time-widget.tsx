import "./game-time-widget.css"

import type { JSX } from "react"

import { worldActions } from "@/engine/store"
import { useWorld } from "@/hooks/useWorld"

/**
 * Fixed time widget - always visible
 */
export const GameTimeWidget = (): JSX.Element => {
  const hour = useWorld((s) => s.gameTime.hour)
  const minute = useWorld((s) => s.gameTime.minute)
  const day = useWorld((s) => s.gameTime.day)
  const isPaused = useWorld((s) => s.isPaused)
  const timeScale = useWorld((s) => s.timeScale)

  const formattedHour = hour.toString().padStart(2, "0")
  const formattedMinute = minute.toString().padStart(2, "0")

  const speeds = [1, 2, 8, 20]

  return (
    <div className="gameTimeWidget">
      <div className="gameTimeWidget__header">
        <div className="gameTimeWidget__timeDisplay">
          <div className="gameTimeWidget__clock">
            {formattedHour}:{formattedMinute}
            {timeScale > 1 && (
              <span
                style={{
                  fontSize: "0.6em",
                  color: "var(--color-green-medium)",
                  marginLeft: "8px",
                }}
              >
                x{timeScale}
              </span>
            )}
          </div>
          <div className="gameTimeWidget__day">Día {day}</div>
        </div>

        <button
          onClick={() => worldActions.togglePause()}
          className="gameTimeWidget__pauseButton"
          title={isPaused ? "Reanudar" : "Pausar"}
        >
          {isPaused ? "▶" : "⏸"}
        </button>
      </div>

      <div className="gameTimeWidget__speedControls">
        {speeds.map((speed) => (
          <button
            key={speed}
            onClick={() => worldActions.setTimeScale(speed)}
            className={`gameTimeWidget__speedButton ${timeScale === speed ? "gameTimeWidget__speedButton--active" : ""}`}
          >
            x{speed}
          </button>
        ))}
      </div>
    </div>
  )
}
