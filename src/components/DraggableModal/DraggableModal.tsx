import React, { useCallback, useEffect, useRef, useState } from "react"

interface DraggableModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  initialWidth?: number
  initialHeight?: number
  minWidth?: number
  minHeight?: number
  children: React.ReactNode
  footer?: React.ReactNode
}

/**
 * DraggableModal - A reusable draggable and resizable modal component
 */
export const DraggableModal: React.FC<DraggableModalProps> = ({
  isOpen,
  onClose,
  title,
  initialWidth = 400,
  initialHeight = 300,
  minWidth = 200,
  minHeight = 150,
  children,
  footer,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  })

  const dragStateRef = useRef({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    startWidth: 0,
    startHeight: 0,
  })

  // Reset size when modal opens
  useEffect(() => {
    if (isOpen) {
      setSize({ width: initialWidth, height: initialHeight })
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen, initialWidth, initialHeight])

  // ========== DRAG HANDLERS ==========
  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.target instanceof HTMLButtonElement ||
        e.target instanceof HTMLSelectElement
      )
        return
      e.preventDefault()

      dragStateRef.current = {
        ...dragStateRef.current,
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startPosX: position.x,
        startPosY: position.y,
      }
    },
    [position],
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      dragStateRef.current = {
        ...dragStateRef.current,
        isResizing: true,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: size.width,
        startHeight: size.height,
      }
    },
    [size],
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const state = dragStateRef.current

      if (state.isDragging) {
        const dx = e.clientX - state.startX
        const dy = e.clientY - state.startY
        setPosition({
          x: state.startPosX + dx,
          y: state.startPosY + dy,
        })
      }

      if (state.isResizing) {
        const dx = e.clientX - state.startX
        const dy = e.clientY - state.startY
        setSize({
          width: Math.max(minWidth, state.startWidth + dx),
          height: Math.max(minHeight, state.startHeight + dy),
        })
      }
    }

    const handleMouseUp = () => {
      dragStateRef.current.isDragging = false
      dragStateRef.current.isResizing = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [minWidth, minHeight])

  // ========== KEYBOARD SHORTCUT ==========
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          zIndex: 9999,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: `calc(50% + ${position.y}px)`,
          left: `calc(50% + ${position.x}px)`,
          transform: "translate(-50%, -50%)",
          width: size.width,
          height: size.height,
          background: "rgba(20, 20, 30, 0.98)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 8,
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header - Draggable */}
        <div
          onMouseDown={handleHeaderMouseDown}
          style={{
            background: "rgba(60, 60, 80, 0.9)",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "grab",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>
            {title}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
              [ESC] close
            </span>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255, 100, 100, 0.3)",
                border: "1px solid rgba(255,100,100,0.5)",
                borderRadius: 4,
                color: "#fff",
                width: 24,
                height: 24,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>

        {/* Footer (optional) */}
        {footer && (
          <div
            style={{
              padding: "8px 12px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}

        {/* Resize handle */}
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            cursor: "nwse-resize",
            background:
              "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.3) 50%)",
          }}
        />
      </div>
    </>
  )
}
