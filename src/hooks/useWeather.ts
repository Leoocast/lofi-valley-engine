import { useState } from "react"

type Weather = "sunny" | "rain" | "storm" | "snow"

export function useWeather() {
  const [weather, setWeather] = useState<Weather>("sunny")

  return { weather, setWeather }
}
