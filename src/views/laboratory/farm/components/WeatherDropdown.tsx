import type { ReactElement } from "react"
import styles from "../styles/Dropdowns.module.scss"

type Weather = "sunny" | "rain" | "storm" | "snow"

interface WeatherDropdownProps {
  value: Weather
  onChange: (weather: Weather) => void
}

const WEATHER_OPTIONS: {
  value: Weather
  label: string
  emoji: string
}[] = [
  { value: "sunny", label: "Sunny", emoji: "☀️" },
  { value: "rain", label: "Rain", emoji: "🌧️" },
  { value: "storm", label: "Storm", emoji: "⛈️" },
  { value: "snow", label: "Snow", emoji: "❄️" },
]

export const WeatherDropdown = ({
  value,
  onChange,
}: WeatherDropdownProps): ReactElement => {
  return (
    <div className={styles.dropdown}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Weather)}
      >
        {WEATHER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.emoji} {option.label}
          </option>
        ))}
      </select>
      <div className={styles.arrow}>▼</div>
    </div>
  )
}
