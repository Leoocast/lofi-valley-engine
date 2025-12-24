import React, { useContext } from "react"

import { SidebarContext } from "@/components/ui/sidebar"

export interface DebugInfoProps {
  children: React.ReactNode
  position?: "top" | "bottom"
  gridColumns?: number
}

export const DebugInfo = ({
  children,
  position = "bottom",
  gridColumns,
}: DebugInfoProps) => {
  const context = useContext(SidebarContext)
  // const sidebarWidth = context?.open ? 250 : 40

  return (
    <div
      style={{
        position: "fixed",
        [position]: 0,
        left: 0,
        right: 0,
        padding: "8px 16px",
        background: "rgba(20, 20, 30, 0.92)",
        backdropFilter: "blur(12px)",
        color: "white",
        fontSize: "12px",
        display: gridColumns ? "grid" : "flex",
        gridTemplateColumns: gridColumns
          ? `repeat(${gridColumns}, 1fr)`
          : undefined,
        justifyContent: gridColumns ? undefined : "space-between",
        alignItems: "center",
        gap: "20px",
        ...(position === "top"
          ? {
              borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }
          : {
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.3)",
            }),
        transition: "left 0.3s ease",
        zIndex: 50,
      }}
    >
      {children}
    </div>
  )
}
