import type { ReactElement } from "react"
import styles from "../styles/UtilityButtons.module.scss"

interface UtilityButtonsProps {
  showGrid: boolean
  onToggleGrid: () => void
  onResetView: () => void
}

export const UtilityButtons = ({
  showGrid,
  onToggleGrid,
  onResetView,
}: UtilityButtonsProps): ReactElement => {
  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={onToggleGrid}
        className={`${styles.button} ${styles.grid} ${!showGrid ? styles.inactive : ""}`}
      >
        {showGrid ? "🟢" : "⚫"} Grid
      </button>

      <button
        type="button"
        onClick={onResetView}
        className={`${styles.button} ${styles.reset}`}
      >
        🔄 Reset
      </button>
    </div>
  )
}
