import React from "react"

import "@/engine/weather/scss/rain.scss"
import "@/engine/weather/scss/snow.scss"
import "@/engine/weather/scss/storm.scss"

import { Rain } from "./Rain"
import { Snow } from "./Snow"
import { Storm } from "./Storm"

interface WeatherProps {
  weather: "sunny" | "rain" | "storm" | "snow"
}

export const Weather = ({
  weather,
}: WeatherProps): React.ReactElement | null => {
  const weatherElement =
    weather === "rain" ? (
      <Rain />
    ) : weather === "storm" ? (
      <Storm />
    ) : weather === "snow" ? (
      <Snow />
    ) : null

  if (!weatherElement) return null

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {weatherElement}
    </div>
  )
}
