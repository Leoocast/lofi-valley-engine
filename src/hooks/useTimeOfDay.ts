import { useState } from "react"

type TimeOfDay = "day" | "afternoon" | "night"

export function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day")

  return { timeOfDay, setTimeOfDay }
}
