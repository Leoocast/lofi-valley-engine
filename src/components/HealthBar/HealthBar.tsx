import type { ReactElement } from "react"

interface HealthBarProps {
  currentHp: number
  maxHp: number
  /** Posición X del centro de la entidad (en píxeles) */
  centerX: number
  /** Posición Y sobre la entidad (en píxeles) */
  topY: number
  /** Z-index (depth de la entidad + 1) */
  zIndex: number
}

/**
 * Barra de HP con efecto "delayed damage" estilo fighting games
 * Diseño pixel art con borde blanco grueso
 * - Barra de color: HP actual (transición rápida)
 * - Barra blanca: HP "fantasma" (transición lenta, delay)
 */
export const HealthBar = ({
  currentHp,
  maxHp,
  centerX,
  topY,
  zIndex,
}: HealthBarProps): ReactElement => {
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100))

  // Color según el % de vida (gradiente rosa → rojo)
  const getHpColor = (percent: number): string => {
    if (percent > 60) return "bg-gradient-to-r from-green-500 to-green-600"
    if (percent > 30) return "bg-gradient-to-r from-orange-500 to-red-500"
    return "bg-gradient-to-r from-red-600 to-red-700"
  }

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: centerX,
        top: topY - 12,
        transform: "translateX(-50%)",
        zIndex: zIndex,
      }}
    >
      {/* Container con borde usando box-shadow múltiple */}
      <div
        className="relative w-14 h-1.5 bg-gray-900"
        style={{
          borderRadius: "2px",
          // Múltiples box-shadows para crear un borde uniforme de 2px
          boxShadow:
            "0 0 0 2px white, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Barra BLANCA (delayed damage) - se queda atrás */}
        <div
          className="absolute top-0 left-0 h-full bg-white transition-all duration-700 ease-out"
          style={{
            width: `${hpPercent}%`,
            borderRadius: "1px",
          }}
        />

        {/* Barra de HP ACTUAL (rápida, con gradiente) */}
        <div
          className={`absolute top-0 left-0 h-full ${getHpColor(hpPercent)} transition-all duration-200 ease-out`}
          style={{
            width: `${hpPercent}%`,
            borderRadius: "1px",
          }}
        />
      </div>
    </div>
  )
}
