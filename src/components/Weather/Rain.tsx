import React from "react"

export const Rain = (): React.ReactElement => (
  <React.Fragment>
    <div className="rain-overlay" />
    <div className="rain-container">
      <div className="rain">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`rain__drop rain__drop--${i + 1}`} />
        ))}
      </div>
    </div>
  </React.Fragment>
)
