import React from "react"

interface TimeOfDayButtonsProps {
  timeOfDay: "day" | "afternoon" | "night"
  onChange: (time: "day" | "afternoon" | "night") => void
}

export const TimeOfDayButtons = ({
  timeOfDay,
  onChange,
}: TimeOfDayButtonsProps): React.ReactElement => (
  <div className="ml-8 flex gap-2 items-center">
    <span className="text-xs opacity-70">Time:</span>
    <button
      onClick={() => onChange("day")}
      type="button"
      className={`rounded px-2 py-1 text-xs ${
        timeOfDay === "day" ? "bg-yellow-500" : "bg-yellow-600/50"
      }`}
    >
      ☀️ Day
    </button>
    <button
      onClick={() => onChange("afternoon")}
      type="button"
      className={`rounded px-2 py-1 text-xs ${
        timeOfDay === "afternoon" ? "bg-orange-500" : "bg-orange-600/50"
      }`}
    >
      🌅 Afternoon
    </button>
    <button
      onClick={() => onChange("night")}
      type="button"
      className={`rounded px-2 py-1 text-xs ${
        timeOfDay === "night" ? "bg-blue-600" : "bg-blue-700/50"
      }`}
    >
      🌙 Night
    </button>
  </div>
)
