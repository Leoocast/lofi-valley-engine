import type { ReactElement } from "react"
import { useState } from "react"

interface MusicPlayerProps {
  isOpen: boolean
  onToggle: () => void
}

/**
 * MusicPlayer - YouTube embed player for lofi music
 * Minimizable, persists across views
 */
export const MusicPlayer = ({
  isOpen,
  onToggle,
}: MusicPlayerProps): ReactElement => {
  const [isMinimized, setIsMinimized] = useState(false)

  // Lofi Girl - beats to relax/study to
  const videoId = "yf5NOyy1SXU"

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,

          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
          zIndex: 9999,
          transition: "all 0.3s ease",
        }}
        title="Open Music Player"
      >
        <span style={{ filter: "grayscale(1) brightness(2)" }}>🎵</span>
      </button>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        width: isMinimized ? 220 : 360,
        background: "rgba(26, 26, 46, 0.98)",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        border: "2px solid rgba(102, 126, 234, 0.3)",
        overflow: "hidden",
        zIndex: 9999,
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>
          <span style={{ filter: "grayscale(1) brightness(2)" }}>🎵</span>
          Lofi Valley Radio
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: 4,
              width: 24,
              height: 24,
              cursor: "pointer",
              color: "white",
              fontSize: 12,
            }}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? "▢" : "─"}
          </button>
          <button
            onClick={onToggle}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: 4,
              width: 24,
              height: 24,
              cursor: "pointer",
              color: "white",
              fontSize: 12,
            }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* YouTube Embed - Always mounted, just hidden when minimized */}
      <div
        style={{
          padding: 8,
          display: isMinimized ? "none" : "block",
        }}
      >
        <iframe
          width="100%"
          height="180"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1`}
          title="Lofi Valley Radio"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: 8 }}
        />
      </div>

      {/* Minimized state indicator */}
      {isMinimized && (
        <div
          style={{
            padding: "8px 14px",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 12,
          }}
        >
          ▶ Playing lofi beats...
        </div>
      )}
    </div>
  )
}
