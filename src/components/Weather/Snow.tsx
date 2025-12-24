import React from "react"

export const Snow = (): React.ReactElement => (
  <React.Fragment>
    <div className="snow-overlay" />
    <div className="snow-container">
      <div className="snow">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className={`snow__flake snow__flake--${i + 1}`} />
        ))}
      </div>
    </div>
  </React.Fragment>
)
