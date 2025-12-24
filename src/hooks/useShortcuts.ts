import { useEffect, useMemo, useRef } from "react"

type Shortcut = Record<string, (e: KeyboardEvent) => void>

export function useShortcuts(
  shortcuts: Shortcut,
  deps: React.DependencyList = [],
) {
  const memoizedShortcuts = useMemo(() => shortcuts, deps)
  const handlerRef = useRef<((e: KeyboardEvent) => void) | null>(null)

  // Actualizar el handler sin recrear el listener
  useEffect(() => {
    handlerRef.current = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      const key = e.key === "Escape" ? "escape" : e.key.toLowerCase()
      memoizedShortcuts[key]?.(e)
    }
  }, [memoizedShortcuts])

  // Agregar listener solo UNA VEZ
  useEffect(() => {
    const handler = (e: KeyboardEvent) => handlerRef.current?.(e)

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])
}
