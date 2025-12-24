import React from "react"

export const Storm = (): React.ReactElement => (
  <React.Fragment>
    <div className="storm-overlay" />
    <div className="storm-container">
      <div className="storm">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className={`storm__drop storm__drop--${i + 1}`} />
        ))}
      </div>
    </div>
    <div className="lightning" />
  </React.Fragment>
)
