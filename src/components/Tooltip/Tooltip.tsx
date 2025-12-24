import type { ReactElement, ReactNode } from "react"

import "./Tooltip.css"

interface TooltipProps {
  content?: string
  children: ReactNode
}

export const Tooltip = ({ content, children }: TooltipProps): ReactElement => {
  if (!content) {
    return <>{children}</>
  }

  return (
    <div className="tooltip-wrapper">
      {children}
      <div className="tooltip">{content}</div>
    </div>
  )
}
