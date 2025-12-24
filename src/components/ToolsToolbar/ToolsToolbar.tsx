import type { ReactElement } from "react"

import { TOOLS } from "@/constants/tools"
import { worldActions } from "@/engine/store"
import { useWorld } from "@/hooks/useWorld"

/**
 * Toolbar de herramientas estilo Figma
 * Fija en la parte inferior con botones táctiles (48px)
 */
export const ToolsToolbar = (): ReactElement => {
  // Selector atómico para la herramienta activa
  const activeTool = useWorld((s) => s.activeTool)

  const handleToolClick = (toolId: (typeof TOOLS)[number]["id"]) => {
    worldActions.setActiveTool(toolId)
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/80 px-4 py-3 shadow-2xl backdrop-blur-md">
        {TOOLS.map((tool) => {
          const isActive = activeTool === tool.id

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => handleToolClick(tool.id)}
              className={`
                group relative flex h-12 w-12 flex-col items-center justify-center
                rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-white/20 shadow-lg ring-2 ring-white/50"
                    : "hover:bg-white/10 hover:shadow-md"
                }
              `}
              title={`${tool.name} (${tool.shortcut})`}
            >
              {/* Emoji */}
              <span className="text-2xl leading-none">{tool.emoji}</span>

              {/* Número de shortcut */}
              <span
                className={`
                  absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
                  rounded-full text-[10px] font-bold
                  ${
                    isActive
                      ? "bg-white text-black"
                      : "bg-white/20 text-white/60 group-hover:bg-white/30"
                  }
                `}
              >
                {tool.shortcut}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
