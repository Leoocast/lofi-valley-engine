import React from "react"

interface WeatherButtonsProps {
  weather: "sunny" | "rain" | "storm" | "snow"
  onChange: (weather: "sunny" | "rain" | "storm" | "snow") => void
}

export const WeatherButtons = ({
  weather,
  onChange,
}: WeatherButtonsProps): React.ReactElement => (
  <div className="ml-8 flex gap-2 items-center">
    <span className="text-xs opacity-70">Weather:</span>
    <button
      onClick={() => onChange("sunny")}
      type="button"
      className={`rounded px-2 py-1 text-xs ${
        weather === "sunny" ? "bg-sky-400" : "bg-sky-600/50"
      }`}
    >
      ☀️ Sunny
    </button>
    <button
      onClick={() => onChange("rain")}
      type="button"
      className={`rounded px-2 py-1 text-xs ${
        weather === "rain" ? "bg-slate-500" : "bg-slate-600/50"
      }`}
    >
      🌧️ Rain
    </button>
    <button
      onClick={() => onChange("storm")}
      type="button"
      className={`rounded px-2 py-1 text-xs ${
        weather === "storm" ? "bg-purple-600" : "bg-purple-700/50"
      }`}
    >
      ⛈️ Storm
    </button>
    <button
      onClick={() => onChange("snow")}
      type="button"
      className={`rounded px-2 py-1 text-xs ${
        weather === "snow" ? "bg-cyan-400" : "bg-cyan-600/50"
      }`}
    >
      ❄️ Snow
    </button>
  </div>
)
